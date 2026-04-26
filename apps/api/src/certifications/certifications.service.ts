import { Injectable, StreamableFile, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

@Injectable()
export class CertificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateCertificateStream(studentId: string, courseId: string): Promise<StreamableFile> {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });

    if (!student || !course) throw new NotFoundException('Étudiant ou Cours introuvable');

    let cert = await this.prisma.certificate.findFirst({
      where: { studentId, courseId }
    });

    if (!cert) {
      cert = await this.prisma.certificate.create({
        data: {
          studentId,
          courseId,
          pdfUrl: '' 
        }
      });
    }

    const verifyUrl = `https://tangart.com/verify/${cert.verificationId}`;
    const qrCodeDataUri = await QRCode.toDataURL(verifyUrl, {
      color: {
        dark: '#D4AF37',
        light: '#0A0A0A00'
      }
    });

    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50,
      info: {
        Title: `Certificat - ${course.title}`,
        Author: 'Tang\'Art',
      }
    });

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#0A0A0A');

    // Borders
    doc.lineWidth(4).strokeColor('#D4AF37')
       .rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
    doc.lineWidth(1)
       .rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

    // Texts
    doc.fillColor('#D4AF37').font('Times-BoldItalic').fontSize(40)
       .text('Certificat d\'Accomplissement', 0, 100, { align: 'center' });

    doc.fillColor('#E8DCC4').font('Times-Roman').fontSize(16)
       .text('Décerné avec les honneurs à', 0, 200, { align: 'center' });

    doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(32)
       .text(student.name || student.email, 0, 240, { align: 'center' });

    doc.fillColor('#E8DCC4').font('Times-Roman').fontSize(16)
       .text('pour avoir suivi avec succès la formation :', 0, 310, { align: 'center' });

    doc.fillColor('#D4AF37').font('Times-BoldItalic').fontSize(24)
       .text(course.title, 0, 350, { align: 'center' });

    doc.fillColor('#E8DCC4').font('Times-Roman').fontSize(12)
       .text('Signé : Tang\'Art', 100, 480);

    // QR Code
    const base64Data = qrCodeDataUri.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(base64Data, 'base64');
    doc.image(qrBuffer, doc.page.width - 150, 440, { width: 80 });
    doc.fontSize(8).fillColor('#666666').text(`ID: ${cert.verificationId}`, doc.page.width - 150, 525);

    doc.end();

    return new StreamableFile(doc);
  }
}

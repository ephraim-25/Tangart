import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*', // For development. i this Should be properly narrowed in prod.
  },
  namespace: '/forums'
})
export class ForumsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChapter')
  async handleJoinChapter(
    @MessageBody() data: { chapterId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `chapter_${data.chapterId}`;
    client.join(room);
    
    // Attempt to grab recent messages from db history
    try {
      const thread = await this.prisma.thread.findUnique({
        where: { chapterId: data.chapterId },
        include: { posts: { include: { author: true }, orderBy: { createdAt: 'asc' } } }
      });

      if (thread) {
        client.emit('threadHistory', thread.posts);
      }
    } catch (e) {
      console.log('Error fetching history or prisma not setup properly yet:', e);
    }

    client.emit('joinedRoom', { room });
    // Notify room that user joined (optional)
    // this.server.to(room).emit('userJoined', { clientId: client.id });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { chapterId: string; content: string; authorId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `chapter_${data.chapterId}`;
    let thread = await this.prisma.thread.findUnique({
      where: { chapterId: data.chapterId },
    });

    if (!thread) {
      // Create thread if it doesn't exist
      thread = await this.prisma.thread.create({
        data: {
          chapter: { connect: { id: data.chapterId } }
        }
      });
    }

    // Persist post
    const post = await this.prisma.post.create({
      data: {
        content: data.content,
        thread: { connect: { id: thread.id } },
        author: { connect: { id: data.authorId } } // In a real app we'd verify auth token from client
      },
      include: {
        author: true
      }
    });

    // Broadcast message to everyone in the room
    this.server.to(room).emit('newMessage', post);
  }
}

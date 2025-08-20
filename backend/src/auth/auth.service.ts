// backend/src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as firebase from 'firebase-admin';

@Injectable()
export class AuthService {
  async validateFirebaseToken(token: string) {
    const decoded = await firebase.auth().verifyIdToken(token);
    let user = await this.prisma.user.findUnique({ where: { email: decoded.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: decoded.email,
          name: decoded.name,
          photos: [decoded.picture],
          isVerified: true,
        },
      });
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwt.sign(payload) };
  }
}
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { AuthSecurityService } from "src/modules/auth/services/auth-security.service";
import { SessionService } from "src/modules/auth/services/session.service";
import { JwtPayload } from "src/modules/auth/strategies/access-token.strategy";

export class WsAuthGuard implements CanActivate {
    constructor(
        private readonly authSecurityService: AuthSecurityService,
        private readonly sessionService: SessionService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();
        try {
            const token = this.extractToken(client);
            const payload: JwtPayload = await this.authSecurityService.verifyAccessToken(token);
            const user = await this.sessionService.validateAccessToken(payload);
            if (!user) {
                throw new WsException('Unauthorized');
            }
            client.data.user = user;
            return true;
        } catch (err) {
            throw new WsException('Unauthorized');
        }
    }

    private extractToken(client: Socket): string {
        const token = client.handshake?.auth.token || client.handshake.headers['authorization']?.split(' ')[1];
        if (!token) {
            throw new WsException('Unauthorized')
        }
        return token;
    }
}
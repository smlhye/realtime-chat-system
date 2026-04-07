import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class SignInLocalGuard extends AuthGuard('local') { }
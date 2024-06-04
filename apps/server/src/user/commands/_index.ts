import { UserLoginCommand } from "./user.login";
import { UserRefreshTokenCommand } from "./user.refreshToken";
import { UserRegisterSendOtpCommand } from "./user.register.sendOtp";
import { UserRegisterVerifyOtpCommand } from "./user.register.verifyOtp";
import { UserResetPasswordSendOtpCommand } from "./user.resetPassword.sendOtp";
import { UserResetPasswordVerifyOtpCommand } from "./user.resetPassword.verifyOtp";

export const commands = [
    UserLoginCommand,
    UserRefreshTokenCommand,
    UserRegisterSendOtpCommand,
    UserRegisterVerifyOtpCommand,
    UserResetPasswordSendOtpCommand,
    UserResetPasswordVerifyOtpCommand
]
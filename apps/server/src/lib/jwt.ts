import { sign, verify } from "jsonwebtoken";
import { doSuccess } from "@server/lib/helpers";
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_EXPIRY, JWT_REFRESH_TOKEN_SECRET, SERVICE_NAME } from "./constants";
import { UserProfile } from "@server/user/entities/userProfile.entity";
import { JWTPayload } from "./interfaces/jwt-payload.dto";

export async function generateJWT(profile: UserProfile) {
    // create jwt payload
    const jwtPayload: JWTPayload = {
        userId: profile.id,
        isAdmin: profile.isAdmin,
        canAddFamily: profile.canAddFamily,
        canTransfer: profile.canTransfer,
        roles: profile.roles,
    };

    // generate JWT token
    const accessToken = sign(jwtPayload, JWT_ACCESS_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: JWT_ACCESS_TOKEN_EXPIRY, audience: SERVICE_NAME, issuer: SERVICE_NAME });
    const refreshToken = sign(jwtPayload, JWT_REFRESH_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: JWT_REFRESH_TOKEN_EXPIRY, audience: `${SERVICE_NAME}::REFRESH_TOKEN`, issuer: SERVICE_NAME });

    return doSuccess('تم تسجيل الدخول بنجاح', 'SUCCESS', {
        user: {
            userId: profile.id,
            firstName: profile.user.firstName,
            lastName: profile.user.lastName,
            isAdmin: profile.isAdmin,
            canAddFamily: profile.canAddFamily,
            canTransfer: profile.canTransfer,
            roles: profile.roles,
        },
        accessToken,
        refreshToken,
    })
}

export function verifyAccessToken(accessToken: string) {
    const jwtPayload = verify(accessToken, JWT_ACCESS_TOKEN_SECRET, { algorithms: ['HS256'], audience: SERVICE_NAME, issuer: SERVICE_NAME }) as JWTPayload;
    return jwtPayload
}

export function verifyRefreshToken(refreshToken: string) {
    const jwtPayload = verify(refreshToken, JWT_REFRESH_TOKEN_SECRET, { algorithms: ['HS256'], audience: `${SERVICE_NAME}::REFRESH_TOKEN`, issuer: SERVICE_NAME }) as JWTPayload;
    return jwtPayload
}

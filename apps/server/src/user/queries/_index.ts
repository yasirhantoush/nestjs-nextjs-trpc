import { AdminUserFindAllQuery } from "./admin.user.findAll";
import { AdminUserFindByIdQuery } from "./admin.user.findById";
import { PostsFindAllQuery } from "./post.findAll";
import { UserGetProfileQuery } from "./user.getProfile";

export const queries = [
    AdminUserFindAllQuery,
    AdminUserFindByIdQuery,
    UserGetProfileQuery,
    PostsFindAllQuery,
]
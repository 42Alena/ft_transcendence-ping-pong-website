import { join, dirname } from "path";

//https://nodejs.org/api/modules.html#__dirname
export const UPLOAD_DIR = join(dirname(__filename), '../avatars/users/')
export const URL_AVATAR_PREFIX = "/avatars/users/";

export const ONLINE_TIMEOUT_SEC = 300;  //for tests: 5 sec. normal:   60–300 sec
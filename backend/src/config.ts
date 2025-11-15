import { join, dirname } from "path";

//https://nodejs.org/api/modules.html#__dirname
export const UPLOAD_DIR = join(dirname(__filename), '../avatars/users/')
import { join, dirname } from "path";

//https://nodejs.org/api/modules.html#__dirname
export const UPLOAD_DIR = join(dirname(__filename), '../avatars/users/')

export const ONLINE_TIMEOUT_SEC = 15;  //for tests 15sec. TODO: later  change to 60–300 sec
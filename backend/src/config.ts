import { join, dirname } from "path";

//https://nodejs.org/api/modules.html#__dirname
export const UPLOAD_DIR = join(dirname(__filename), '../avatars/users/')

export const ONLINE_TIMEOUT_SEC = 5;  //for tests 5 sec. TODO: later  change to 60–300 sec
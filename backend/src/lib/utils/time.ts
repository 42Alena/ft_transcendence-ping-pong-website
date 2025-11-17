import { Time } from "../types/domain";


export function unixTimeNow(): Time {
	return Math.floor(Date.now() / 1000);  //in seconds
}
 
import { TimeSec } from "../types/domain";


export function unixTimeNow(): TimeSec {
	return Math.floor(Date.now() / 1000);  //in seconds
}
 
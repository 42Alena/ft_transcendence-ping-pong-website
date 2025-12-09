import { TimeSec } from "../types/domain";


export function unixTimeNow(): TimeSec {
	return Math.floor(Date.now() / 1000);  //in seconds
}
 

export function formatDateDDMMYY(createdAtSec: number): string {
	const d = new Date(createdAtSec * 1000); // TimeSec → ms

	const day   = d.getDate().toString().padStart(2, "0");
	const month = (d.getMonth() + 1).toString().padStart(2, "0"); // 0-based
	const year  = (d.getFullYear() % 100).toString().padStart(2, "0"); // 2025 ->"25"

	return `${day}/${month}/${year}`; // "08/12/25"
}

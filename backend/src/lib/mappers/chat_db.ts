import { MessageDbRow } from '../types/db';
import type *  as Domain from '../types/domain';
 


// Conversion: DB row =>  message  
export function chatFromDbRow(row: ChatDbRow): Domain.Message {
	return {
		id: row.id,
		type: row.type,
		senderId: row.senderId,
		receiverId: row.receiverId,
		content: row.content,
		meta: row.meta,
		createdAt: row.createdAt
	}
}




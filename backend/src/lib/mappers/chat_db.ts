import { MessageDbInsertRow, MessageDbRow } from '../types/db';
import type *  as Domain from '../types/domain';
 


// Conversion: DB row =>  message  
export function messageFromDbRow(row: MessageDbRow): Domain.Message {
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


// Domain message (for saving) -> DB insert row
export function messageToDbRow(message: Domain.MessageTypeChat): MessageDbInsertRow {
	return {
		type: message.type,
		senderId: message.senderId,
		receiverId: message.receiverId,
		content: message.content,
		meta: null,  // or message.meta if  need later
	};
}

import { MessageDbInsertRow, MessageDbRow } from '../types/db';
import type *  as Domain from '../types/domain';
 




// Conversion: DB row =>  message  
export function messageFromDbRow(row: MessageDbRow): Domain.MessageChat {
	return {
		id: row.id,
		type: row.type,
		senderId: row.senderId,
		receiverId: row.receiverId,
		content: row.content,
		// meta: row.meta ? JSON.parse(row.meta) as Domain.Meta : null,
		createdAt: row.createdAt
	}
}



// Domain message (for saving) -> DB insert row
export function messageToDbRow(message: Domain.NewMessageChat): MessageDbInsertRow {
	return {
		type: message.type,
		senderId: message.senderId,
		receiverId: message.receiverId,
		content: message.content,
		// meta: message.meta ? JSON.stringify(message.meta) : null,  
	};
}

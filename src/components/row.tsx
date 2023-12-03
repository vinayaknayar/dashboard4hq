// Desc: This file contains the row component for the table
"use client"

import React, { useState, useRef } from 'react';
import { EditNote, DeleteOutline, SaveAs, Close } from '@mui/icons-material';

interface RowProps {
	details?: {
		id: number
		name: string
		email: string
		role: string
	}
	header: boolean
	selected: boolean
	onSelect: (row: any) => void
	deleteRow?: (row: any) => void
	editRow?: (row: any) => void
}

export default function Row({ details, header, selected, onSelect, deleteRow, editRow }: RowProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedDetails, setEditedDetails] = useState(details || { id: 0, name: '', email: '', role: '' });
	const checkbox = useRef<HTMLInputElement>(null);

	const selectRow = () => {
		if (checkbox.current) {
			checkbox.current.click();
			onSelect(details);
		}
	};

	const selectAll = () => {
		if (checkbox.current) {
			onSelect('selectall');
		}
	};

	const deleteItem = () => {
		if (deleteRow) {
			deleteRow(details);
		}
	}

	const handleEdit = () => {
		setIsEditing(true);
		if (editRow) {
			editRow(details);
		}
	}

	const handleSave = () => {
		setIsEditing(false);
		if (editRow) {
			editRow(editedDetails);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditedDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};


	return (
		<div
			className={`flex flex-row items-center justify-around min-h-[56px] px-6 bg-white cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 dark:border-zinc-600 border-b border-gray-300 dark:border-gray-400 ${selected ? 'bg-zinc-200 dark:bg-zinc-600' : ''}`}
			onClick={header ? selectAll : selectRow}
		>
			<input
				id="checkbox"
				type="checkbox"
				ref={checkbox}
				className="w-4 h-4 mx-12 bg-gray-100 border-gray-300  focus:ring-3 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
				onChange={selectRow}
				checked={selected}
			/>
			{!isEditing ? (
				header ? (
					<div className="flex flex-row justify-around w-full font-semibold text-gray-500 dark:text-zinc-100 ml-6">
						<span className="w-1/3 ">Name</span>
						<span className="w-1/3 ">Email</span>
						<span className="w-1/3 ">Role</span>
						<span className="w-1/3 ">Actions</span>
					</div>
				) : (
					<div className="flex flex-row justify-around w-full  items-center w-full ml-6 dark:text-zinc-300">
						<span className="w-1/3 ">{details ? details.name : ""}</span>
						<span className="w-1/3 ">{details ? details.email : ""}</span>
						<span className="w-1/3 ">{details ? details.role : ""}</span>
						<div className="w-1/3 flex ">
							<div className="flex">
								<button className="edit w-6 h-6 mr-3 p-4 flex items-center justify-center rounded-md border border-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700" onClick={handleEdit}>
									<EditNote />
								</button>

								<button className="delete w-6 h-6 p-4 flex text-red-500 items-center justify-center rounded-md border border-red-500 hover:bg-gray-100 dark:hover:bg-zinc-700" onClick={() => deleteRow && deleteRow(details)}>
									<DeleteOutline />
								</button>
							</div>
						</div>
					</div>
				)
			) : (
				<div className="flex flex-row items-center w-full ml-6 dark:text-zinc-300">
					<div className="w-1/3">
						<input type="text" name="name" value={editedDetails.name} onChange={handleInputChange} className="w-[95%] bg-gray-100 border border-gray-300 focus:ring-2 rounded-md px-2 py-1 mr-2 dark:bg-zinc-700" />
					</div>
					<div className="w-1/3">
						<input type="text" name="email" value={editedDetails.email} onChange={handleInputChange} className="w-[95%] bg-gray-100 border border-gray-300 focus:ring-2 rounded-md px-2 py-1 mr-2 dark:bg-zinc-700" />
					</div>
					<div className="w-1/3">
						<input type="text" name="role" value={editedDetails.role} onChange={handleInputChange} className="w-[95%] bg-gray-100 border border-gray-300 focus:ring-2 rounded-md px-2 py-1 mr-2 dark:bg-zinc-700" />
					</div>
					<div className="flex w-1/3">
						<button onClick={handleSave} className="save w-6 h-6 mr-3 p-4 flex items-center justify-center rounded-md text-green-600 border border-green-600 ">
							<SaveAs />
						</button>
						<button onClick={() => setIsEditing(false)} className="cancel w-6 h-6 mr-3 p-4 flex items-center justify-center border border-gray-500 rounded-md">
							<Close />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}


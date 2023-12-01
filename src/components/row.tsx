// Desc: This file contains the row component for the table
"use client"

import React, { useState, useRef } from 'react';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface RowProps {
	details: {
		name: string
		email: string
		role: string
	}
	header: boolean
}

export default function Row({ details, header }: RowProps) {
	const [isChecked, setIsChecked] = useState(false);
	const checkbox = useRef<HTMLInputElement>(null);

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsChecked(e.target.checked);
	};

	const selectRow = () => {
		if (checkbox.current) {
			checkbox.current.click();
		}
	}


	return (
		<div
			className={`flex flex-row items-center justify-around w-full h-16 px-6 bg-white cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 dark:bg-zinc-800 dark:border-zinc-600 border-b border-gray-300 dark:border-gray-400 ${isChecked ? 'bg-zinc-200 dark:bg-zinc-600' : ''}`}
			onClick={selectRow}
		>
			<input
				id="checkbox"
				type="checkbox"
				ref={checkbox}
				className="w-4 h-4 bg-gray-100 border-gray-300  focus:ring-3 dark:bg-gray-700 dark:border-gray-600 hover:pointer"
				onChange={handleCheckboxChange}
			/>
			{header ? (
				<div className="flex flex-row justify-around w-full font-semibold text-gray-500 dark:text-zinc-100  ml-6">
					<span className="w-1/3">Name</span>
					<span className="w-1/3">Email</span>
					<span className="w-1/3">Role</span>
					<span className="w-1/3">Actions</span>
				</div>

			) : (
				<div className="flex flex-row justify-around items-center w-full ml-6 dark:text-zinc-300">
					<span className="w-1/3">{details.name}</span>
					<span className="w-1/3">{details.email}</span>
					<span className="w-1/3">{details.role}</span>
					<div className="w-1/3 flex">
						<div className="flex">
							<button className="w-6 h-6 mr-3 p-4 flex items-center justify-center rounded-md border border-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700">
								<EditNoteIcon />
							</button>
							<button className="w-6 h-6 p-4 flex text-red-500 items-center justify-center rounded-md border border-red-500 hover:bg-gray-100 dark:hover:bg-zinc-700">
								<DeleteOutlineIcon />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

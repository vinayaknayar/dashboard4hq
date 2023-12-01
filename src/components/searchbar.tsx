import { useState, KeyboardEvent } from 'react';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
	onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState('');

	const Search = (searchText: string) => {
		setSearchTerm(searchText);
		onSearch(searchText);
	};

	const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.currentTarget.value === '') {
			Search('');
		}
		setSearchTerm(e.currentTarget.value);

	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			Search(e.currentTarget.value);
		}
	};

	return (
		<div className="flex w-2/3 items-center border border-gray-300 rounded-lg p-2">
			<input
				type="text"
				placeholder="Search..."
				value={searchTerm}
				onChange={handleValueChange}
				onKeyDown={handleKeyDown}
				className="flex-1 focus:outline-none"
			/>
			<button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-700">
				<SearchIcon onClick={() => Search(searchTerm)} />
			</button>
		</div>
	);
};

export default SearchBar;

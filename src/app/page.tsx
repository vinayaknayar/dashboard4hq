"use client"

import { useState, useEffect } from 'react'
import Row from '@/components/row'
import SearchBar from '@/components/searchbar';
import { ChevronLeft } from '@mui/icons-material';
import { ChevronRight } from '@mui/icons-material';

export default function Home() {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
        const response = await fetch(url);
        const data = await response.json();
        setRowData(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const details = {
    name: 'John Doe',
    email: 'johndoe@mail.com',
    role: 'admin',
  }
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const Search = (searchTerm: string) => {
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(Boolean);
    console.log(searchTerms.length);

    const filtered = searchTerms.length
      ? rowData.filter((row: any) =>
        searchTerms.every(term =>
          Object.values(row).some((value: any) =>
            value.toString().toLowerCase().includes(term)
          )
        )
      )
      : rowData;

    setFilteredData(filtered);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }

  return (
    <main className="flex flex-col h-screen overflow-y-hidden">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <SearchBar onSearch={Search} />
      </div>
      <div className="flex flex-col w-[calc(100%-3rem)] overflow-y-auto border border-gray-300 rounded-lg shadow mx-auto p-2 bg-white dark:bg-zinc-800">
        <Row details={details} header={true} />
        {getPaginatedData().map((dataItem, index) => (
          <Row key={index} details={dataItem} header={false} />
        ))}
      </div>
      <div className="flex justify-end items-center p-8 text-gray-900 dark:text-zinc-100">
        <span className="mr-2">Page {currentPage} of {totalPages}</span>
        <button className="w-8 h-8 mx-1 flex items-center justify-center rounded-lg border bg-gray-100 dark:bg-zinc-700" onClick={prevPage}>
          <ChevronLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} className={`w-8 h-8 mx-1 flex items-center justify-center rounded-lg border ${page === currentPage ? 'bg-gray-100 dark:bg-zinc-700' : 'bg-white dark:bg-zinc-800'}`} onClick={() => goToPage(page)}>
            {page}
          </button>
        ))}
        <button className="w-8 h-8 mx-1 flex items-center justify-center rounded-lg border bg-gray-100 dark:bg-zinc-700" onClick={nextPage}>
          <ChevronRight />
        </button>
      </div>
    </main>
  )
}

"use client"

import { useState, useEffect } from 'react'
import Row from '@/components/row'
import SearchBar from '@/components/searchbar';

export default function Home() {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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

  const Search = (searchTerm: string) => {
    const searchTerms = searchTerm.toLowerCase().split(' ').filter(Boolean); 
  
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
  
  return (
    <main className="flex flex-col h-screen overflow-y-hidden">
      <div className="flex items-center justify-between w-full px-6 py-4 bg-white border-gray-300 dark:bg-zinc-800 dark:border-zinc-600">

      <SearchBar onSearch={Search} />
      </div>
      <div className="flex flex-col w-[calc(100%-3rem)] overflow-y-auto border border-gray-300 rounded-lg shadow mx-auto p-2 bg-white dark:bg-zinc-800">
        <Row details={details} header={true} />
        {filteredData.map((dataItem, index) => (
          <Row key={index} details={dataItem} header={false} />
        ))}
      </div>
      <div>hello</div>
    </main>
  )
}

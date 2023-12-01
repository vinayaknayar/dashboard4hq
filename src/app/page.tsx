"use client"

import { useState, useEffect } from 'react'
import Row from '@/components/row'

export default function Home() {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
        const response = await fetch(url);
        const data = await response.json();
        setRowData(data); 
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

  return (
    <main className="flex flex-col h-screen overflow-y-hidden">
      <div>hello</div>
      <div className="flex flex-col w-[calc(100%-3rem)] overflow-y-auto border border-gray-300 rounded-lg shadow mx-auto mt-[10px] p-2 bg-white dark:bg-zinc-800">
        <Row details={details} header={true} />
        {rowData.map((dataItem, index) => (
          <Row key={index} details={dataItem} header={false} />
        ))}
      </div>
      <div>hello</div>
    </main>
  )
}

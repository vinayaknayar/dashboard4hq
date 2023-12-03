"use client"

import { useState, useEffect } from 'react'
import Row from '@/components/row'
import SearchBar from '@/components/searchbar';
import { ChevronLeft, ChevronRight, DeleteOutline } from '@mui/icons-material';

export default function Home() {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [allselected, setAllSelected] = useState(false);
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
        console.log('Error fetching data:', error);
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

  const deleteRow = (row: any) => {
    const updatedData = rowData.filter((dataItem: any) => dataItem.id !== row.id);
    setRowData(updatedData);
    setFilteredData(updatedData);
  };
  
  const handleRowSelection = (row: any) => {
    const isSelected = selectedRows.some((r: any) => r.id === row.id);

    if (isSelected) {
      const updatedSelection = selectedRows.filter((r: any) => r.id !== row.id);
      setSelectedRows(updatedSelection);
    } else {
      setSelectedRows([...selectedRows, row]);
    }
    console.log(selectedRows)
  };

  const handleSelectAll = () => {
    const allselected = allRowsSelected()
    console.log(allRowsSelected())
    if (allselected) {
      setSelectedRows([]);
      setAllSelected(false);
      return;
    }
    const allSelectedRows = getPaginatedData().filter(
      (dataItem) => !selectedRows.some((row) => row.id === dataItem.id)
    );
    setSelectedRows([...selectedRows, ...allSelectedRows]);
    console.log(selectedRows);
    setAllSelected(true);
  };

  const allRowsSelected = () => {
    const paginatedData = getPaginatedData();
    return paginatedData.length > 0 && paginatedData.every((row: any) => row.selected);
  };

  const deleteSelectedRows = () => {
    const updatedData = rowData.filter(
      (row: any) => !selectedRows.some((selectedRow: any) => selectedRow.id === row.id)
    );
    setRowData(updatedData);
    setFilteredData(updatedData);
    setSelectedRows([]);
    setAllSelected(false);
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

    return filteredData.slice(startIndex, endIndex).map((dataItem: any) => ({
      ...dataItem,
      selected: selectedRows.some((row: any) => row.id === dataItem.id),
    }));
  };

  return (
    <main className="flex flex-col h-screen overflow-y-hidden">
      {/* seearchbar */}
      <div className="flex items-center justify-between w-full px-6 py-4">
        <SearchBar onSearch={Search} />
        <button
          className={`w-10 h-10 mr-2 p-4 flex items-center justify-center text-white rounded-lg border ${selectedRows.length === 0 ? 'bg-gray-500 cursor-default ' : 'bg-red-500 hover:bg-red-600'}`}
          disabled={selectedRows.length === 0}
          onClick={deleteSelectedRows}
        >
          <DeleteOutline />
        </button>
      </div>
      {/* table */}
      <div className="flex flex-col w-[calc(100%-3rem)] overflow-y-auto border border-gray-300 rounded-lg shadow mx-auto p-2 bg-white dark:bg-zinc-800">
        <Row key={currentPage} details={details} header={true} onSelect={handleSelectAll} selected={allRowsSelected()} />
        {getPaginatedData().map((dataItem, index) => (
          <Row
            key={dataItem.id}
            details={dataItem}
            header={false}
            onSelect={handleRowSelection}
            selected={allRowsSelected() ? true : dataItem.selected}
            deleteRow={deleteRow} 
          />
        ))}
      </div>
        {/* paginator */}
      <div className="flex justify-between items-center p-8 text-gray-900 dark:text-zinc-100">
        <div className="flex items-center justify-center">
          {selectedRows.length} of {rowData.length} row(s) selected
        </div>
        <div className="flex items-center justify-center">
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

      </div>
    </main>
  )
}

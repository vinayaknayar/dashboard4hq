"use client"

import { useState, useEffect } from 'react'
import Row from '@/components/row'
import SearchBar from '@/components/searchbar';
import { ChevronLeft, ChevronRight, DeleteOutline, KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight } from '@mui/icons-material';

export default function Home() {
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

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
        console.log('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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
  };

  const handleSelectAll = () => {
    const allselected = allRowsSelected();
    if (allselected) {
      setSelectedRows([]);
      return;
    }
    const allSelectedRows = getPaginatedData().filter(
      (dataItem) => !selectedRows.some((row) => row.id === dataItem.id)
    );
    setSelectedRows([...selectedRows, ...allSelectedRows]);
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

  const SaveEdit = (editedDetails: any) => {
    const updatedData = rowData.map((row: any) => {
      if (row.id === editedDetails.id) {
        return {
          ...row,
          ...editedDetails,
        };
      } else {
        return row;
      }
    }) as any;

    setRowData(updatedData);
    setFilteredData(updatedData);
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {/* searchbar */}
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
      <div className="flex flex-col w-[calc(100%-3rem)] overflow-auto border border-gray-300 rounded-lg shadow mx-auto p-2 bg-white dark:bg-zinc-800">
        <div className='min-w-[1080px] w-full'>
          <Row key={currentPage} header={true} onSelect={handleSelectAll} selected={allRowsSelected()} />
        </div>
        {getPaginatedData().map((dataItem, index) => (
          <div key={index} className='min-w-[1080px] w-full'>
            <Row
              key={dataItem.id}
              details={dataItem}
              header={false}
              onSelect={handleRowSelection}
              selected={allRowsSelected() ? true : dataItem.selected}
              deleteRow={deleteRow}
              editRow={SaveEdit}
            />
          </div>
        ))}
      </div>
      {/* paginator */}
      <div className="flex flex-col gap-1 justify-between items-center p-8 text-gray-900 dark:text-zinc-100 md:flex-row">
        <div className="flex items-center justify-center">
          {selectedRows.length} of {rowData.length} row(s) selected
        </div>
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
          <span className="mr-2">Page {currentPage} of {totalPages}</span>
          <div className="flex flex-row items-center justify-center">
            <button className="w-8 h-8 mx-1 flex items-center justify-center rounded-lg border bg-gray-100 dark:bg-zinc-700" onClick={() => goToPage(1)}>
              <KeyboardDoubleArrowLeft />
            </button>
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
            <button className="w-8 h-8 mx-1 flex items-center justify-center rounded-lg border bg-gray-100 dark:bg-zinc-700" onClick={() => goToPage(totalPages)}>
              <KeyboardDoubleArrowRight />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

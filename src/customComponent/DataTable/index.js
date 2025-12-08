import React from 'react'
import DataTable from 'react-data-table-component';

const DataTableBase = (props) => {
  return (
    <DataTable
      pagination
      paginationPerPage={50} // Default rows per page
      paginationRowsPerPageOptions={[50, 100, 200, 500, 1000]}
      direction="auto"
      responsive
      subHeaderAlign="right"
      subHeaderWrap
      striped
      highlightOnHover
      fixedHeader
      {...props}
    />
  )
}

export default DataTableBase

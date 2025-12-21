import { useState } from 'react';

const DataTable = ({ title, columns, data, filters, onFilterChange, onAddNew }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">{title}</h2>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          {filters.map((filter) => (
            <div key={filter.name} className="w-full md:w-auto">
              {filter.type === 'select' ? (
                <select
                  className="input"
                  value={filter.value}
                  onChange={(e) => onFilterChange(filter.name, e.target.value)}
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : filter.type === 'date' ? (
                <input
                  type="date"
                  className="input"
                  value={filter.value}
                  onChange={(e) => onFilterChange(filter.name, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className="input"
                  placeholder={filter.placeholder}
                  value={filter.value}
                  onChange={(e) => onFilterChange(filter.name, e.target.value)}
                />
              )}
            </div>
          ))}
          <button 
            className="btn btn-primary"
            onClick={onAddNew}
          >
            <i className="fas fa-plus mr-2"></i>
            Add New
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                {columns.map((column) => (
                  <td key={`${row.id}-${column}`} className="text-gray-900 dark:text-gray-300">
                    {column === 'Actions' ? (
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200" title="View">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200" title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ) : (
                      row[column.toLowerCase().replace(' ', '_')] || row[column.toLowerCase()]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, data.length)}</span> of <span className="font-medium">{data.length}</span> results
          </div>
          <div className="flex space-x-1">
            <button 
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded-lg ${currentPage === i + 1 ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'} transition-colors duration-200`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
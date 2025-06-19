"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTable, usePagination, useSortBy, useGlobalFilter } from "react-table";
import InstituteModal from "@/pages/superadmin/InstituteModal";
import { getContract } from "../../lib/web3";

export default function AdminTableView({ title, fetchData, columnsDef, modalType }) {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editData, setEditData] = useState(null);

  const columns = useMemo(() => columnsDef, [columnsDef]);
  const data = useMemo(() => dataList, [dataList]);

  useEffect(() => {
    setModalOpen(false);
    load();
  }, [fetchData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    state: { pageIndex, globalFilter },
    setGlobalFilter,
  } = useTable({ columns, data, initialState: { pageSize: 5 } }, useGlobalFilter, useSortBy, usePagination);

  async function load() {
    setLoading(true);
    const data = await fetchData();
    setDataList(data || []);
    setLoading(false);
  }

  const handleSaveInst = async (instObj) => {
    const isEditing = !!editData;
    const toastId = toast.loading(isEditing ? "Updating Institute..." : "Adding Institute...");
    let success = false;

    try {
      const vc = await getContract();
      let tx;
      if (isEditing) {
          // Update institute
          tx = await vc.updateInstitute(instObj.name, instObj.address);
      } else {
          // Add institute
          tx = await vc.addInstitute(instObj.name, instObj.address);
      }
      await tx.wait();

      toast.success(
          isEditing ? "Institute updated successfully." : "Institute added successfully.",
          { id: toastId }
      );
      success = true;
    } catch (error) {
      toast.error(error?.reason || error?.message || "Operation failed", { id: toastId });
    }
    if (success) {
      try {
          setEditData(null);
          setModalOpen(false);
          await load(); // Reload updated data
      } catch (err) {
          console.warn("Non-critical error after save:", err);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">{title}</h1>
        <button
          onClick={() => { setModalMode("add"); setModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add
        </button>
      </div>

      <input
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder={`Search ${title.toLowerCase()}...`}
        className="w-full max-w-sm p-2 border rounded-lg mb-4"
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table {...getTableProps()} className="min-w-full">
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="p-3 text-left font-medium cursor-pointer"
                  >
                    {column.render("Header")}
                    {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="border-t hover:bg-gray-50">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="p-3">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {page.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
          </span>
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {modalType === "institute" && (
        <InstituteModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSaveInst}
          mode={modalMode}
          initialData={editData}
        />
      )}
    </div>
  );
}

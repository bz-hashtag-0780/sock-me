import 'regenerator-runtime/runtime';
import { FC, useState } from 'react';
import {
	useTable,
	useSortBy,
	usePagination,
	useFilters,
	useGlobalFilter,
	useAsyncDebounce,
} from 'react-table';
import styled from 'styled-components';
type AnyProps = {
	preGlobalFilteredRows: any
	globalFilter: any
	setGlobalFilter: any
}
const GlobalFilter: FC<AnyProps> = ({
	preGlobalFilteredRows,
	globalFilter,
	setGlobalFilter,
}) => {
	const count = preGlobalFilteredRows.length;
	const [value, setValue] = useState(globalFilter);
	const onChange = useAsyncDebounce((value: any) => {
		setGlobalFilter(value || undefined);
	}, 200);

	return (
		<span>
			Search:{' '}
			<input
				value={value || ''}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
				placeholder={`Jacob Slacker, bz, etc..`}
				style={{
					fontSize: '1.1rem',
					border: '0',
				}}
			/>
		</span>
	);
}

type Props = {
	columns: any;
	data: any;
};

// Create a default prop getter
const defaultPropGetter = () => ({});

const Table: FC<Props> = ({
	columns,
	data
}) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page, // Instead of using 'rows', we'll use page,
		// which has only the rows for the active page

		// The rest of these things are super handy, too ;)
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize },
		state,
		preGlobalFilteredRows,
		setGlobalFilter,
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0 },
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	return (
		<>
			{/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2,
          )}
        </code>
		
      </pre> */}

			<GlobalFilter
				preGlobalFilteredRows={preGlobalFilteredRows}
				globalFilter={state.globalFilter}
				setGlobalFilter={setGlobalFilter}
			/>
			<table {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup: any, i: any) => (
						<tr key={i} {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column: any, i: any) => (
								// Add the sorting props to control sorting. For this example
								// we can add them into the header props
								<th key={i}
									{...column.getHeaderProps(
										column.getSortByToggleProps()
									)}
								>
									{column.render('Header')}
									{/* Add a sort direction indicator */}
									<span>
										{column.isSorted
											? column.isSortedDesc
												? ' ▼'
												: ' ▲'
											: ''}
									</span>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row: any, i: any) => {
						prepareRow(row);
						return (
							<tr key={i}
							>
								{row.cells.map((cell: any, i: any) => {
									return (
										<td key={i} {...cell.getCellProps()}>
											{cell.render('Cell')}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			{/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
			<div className="pagination">
				<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
					{'<<'}
				</button>{' '}
				<button
					onClick={() => previousPage()}
					disabled={!canPreviousPage}
				>
					{'<'}
				</button>{' '}
				<button onClick={() => nextPage()} disabled={!canNextPage}>
					{'>'}
				</button>{' '}
				<button
					onClick={() => gotoPage(pageCount - 1)}
					disabled={!canNextPage}
				>
					{'>>'}
				</button>{' '}
				<span>
					Page{' '}
					<strong>
						{pageIndex + 1} of {pageOptions.length}
					</strong>{' '}
				</span>
				<span>
					| Go to page:{' '}
					<input
						type="number"
						defaultValue={pageIndex + 1}
						onChange={(e) => {
							const page = e.target.value
								? Number(e.target.value) - 1
								: 0;
							gotoPage(page);
						}}
						style={{ width: '100px' }}
					/>
				</span>{' '}
				<select
					value={pageSize}
					onChange={(e) => {
						setPageSize(Number(e.target.value));
					}}
				>
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							Show {pageSize}
						</option>
					))}
				</select>
			</div>
		</>
	);
};

export default Table;

export const TableStyles = styled.div`
	padding: 1rem;
	color: #fff;
	font-size: 1.2em;
	table {
		border-spacing: 0;
		/* border: 1px solid black; */

		tr {
			cursor: pointer;
			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}

		th,
		td {
			margin: 0;
			padding: 0.5rem;
			border-bottom: 1px solid #eaeaea15;
			/* border-right: 1px solid black; */
			font-weight: 400;
			text-align: left;

			:last-child {
				border-right: 0;
			}
		}
	}
	.pagination {
		padding: 0.5rem;
	}

	width: 100%;
	overflow: hidden;
	overflow-x: scroll;
	-ms-overflow-style: none;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`;

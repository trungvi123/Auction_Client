import { MaterialReactTable } from "material-react-table";
import { type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";

interface IProTable {
  name: string;
  images: string;
  status: string;
  _id: string;
}

//a more complex example with nested data

function ProductsTable({
  data,
}: any) {
  let dataLocal: IProTable[] = []
  if(data){
    dataLocal = data?.map((item: any) => {
    return {
      name: item.name,
      images: item.images[0],
      status: item.status,
      _id: item._id,
    };
  });
  }
  

  const columns = useMemo<MRT_ColumnDef<IProTable>[]>(
    () => [
      {
        header: "Ảnh",
        accessorKey: "images",
        id: "images",
        // eslint-disable-next-line jsx-a11y/alt-text
        Cell: ({ cell }) => <img width={120} height={120} src={cell.getValue<string>()} />,
      },
      {
        header: "Tên tài sản",
        accessorKey: "name",
        id: "name",
      },
      {
        header: "Trạng thái",
        accessorKey: "status",
        id: "status",
      },
      {
        header: "Xử lí",
        Cell: ({ cell }) => <div>
          <div className="btn-11">
            <span className="btn-11__content">Sửa</span>
          </div>
          <div className="btn-11 mt-2">
            <span className="btn-11__content">Xóa</span>
          </div>
        </div>,
      },
    ],
    []
  );
  return (
    <MaterialReactTable
      columns={columns}
      data={dataLocal}
      enableRowSelection //enable some features
      enableColumnOrdering
      enableGlobalFilter={true} //turn off a feature
    />
  );
}

export default ProductsTable;

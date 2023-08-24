import {
  MaterialReactTable,
} from "material-react-table";
import { type MRT_ColumnDef } from "material-react-table";
import { useCallback, useMemo } from "react";
import { Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setIdItemDelete, setMessage, setShow } from "../../redux/myModalSlice";
import { auction } from "../../asset/images";
import { Link } from "react-router-dom";



interface IProTable {
  name: string;
  images: string;
  status: string;
  _id: string;
}

//a more complex example with nested data

function ProductsTable({ data }: any) {
  let dataLocal: IProTable[] = [];
  const dispatch = useDispatch();

  const handleDelete = useCallback((_id:string) => {
    dispatch(setShow());
    dispatch(setMessage("Bạn có chắc muốn xóa?"));
    dispatch(setIdItemDelete(_id))
  }, [dispatch]);

  if (data) {
    dataLocal = data?.map((item: any) => {
      return {
        name: item.name,
        images: item.images[0] ? item.images[0] : auction,
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
        Cell: ({ cell }) => (
          <Image width={120} height={120} src={cell.getValue<string>()} />
        ),
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
        accessorKey: "_id",
        Cell: ({ cell }) => (
          <div>
            <Link to={`/chinh-sua-dau-gia/${cell.getValue<string>()}`} className="btn-11">
              <span className="btn-11__content">Sửa</span>
            </Link >
            <div className="btn-11 mt-2">
              <span className="btn-11__content" onClick={()=>handleDelete(cell.getValue<string>())}>
                Xóa
              </span>
            </div>
          </div>
        ),
      },
    ],
    [handleDelete]
  );
  return (
    <MaterialReactTable
      columns={columns}
      data={dataLocal}
      enableColumnOrdering
      enableGlobalFilter={true} //turn off a feature
    />
  );
}

export default ProductsTable;

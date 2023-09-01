import dynamic from "next/dynamic"
const AdminLayout = dynamic(()=>import("../../../components/dashboards/admin/adminlayout"))
const Title = dynamic(()=>import("../../../components/title"))

export default function SalesReport() {
  return (
    <>
      <Title page="Sales Report"></Title>
      <AdminLayout>
        <div>
          <h3>Sales Report</h3>
        </div>
      </AdminLayout>
    </>
  )
}
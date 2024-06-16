export default function OneWork({ params } : { params: { id: string }}){
    return <div>Work Page, id: {params.id}</div>
}
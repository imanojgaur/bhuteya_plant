export default async function Page(
    {params}:{ params: Promise<{slug:string}>}
)
{ 
    const slug = (await params).slug;
    const pageName = slug.replace("-", " ")
    return (
        <section>
            <h1 className="font-bold text-3xl text-yellow-200 capitalize">{pageName}</h1>
            
        </section>
                    
    );
    
}
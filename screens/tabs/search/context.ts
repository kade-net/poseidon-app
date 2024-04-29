import { createContext } from "react";


const searchContext = createContext<{
    search: string,
    setSearch: (search: string) => void
}>({
    search: '',
    setSearch: () => { }
})

export default searchContext
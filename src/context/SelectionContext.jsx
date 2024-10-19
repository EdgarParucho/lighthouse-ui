import { useState, useContext, createContext } from 'react'

const SelectionContext = createContext()

export const SelectionProvider = ({ children }) => {
  const [selectedData, setSelectedData] = useState(null)
  return (
    <SelectionContext.Provider value={{ selectedData, setSelectedData }}>
      {children}
    </SelectionContext.Provider>
  )
}

export const useSelectionContext = () => useContext(SelectionContext)

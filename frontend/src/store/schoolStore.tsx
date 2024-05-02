import { create } from 'zustand'

interface State {
  selectedSchool: string
  setSelectedSchool: (school: string) => void
}

const useSchoolStore = create<State>((set) => ({
  selectedSchool: 'All',
  setSelectedSchool: (school) => { set({ selectedSchool: school }) }
}))

export default useSchoolStore

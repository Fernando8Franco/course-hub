import Cursos from '../components/react-components/Courses'
import Title from '@/components/react-components/Title'
import Filter from '@/components/react-components/Filter'

export default function HomePage () {
  return (
    <>
      <Title title='Cursos' filter={<Filter/>}/>
      <Cursos/>
    </>
  )
}

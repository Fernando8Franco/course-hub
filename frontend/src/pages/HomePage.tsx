import Main from '@/components/react-components/Main'
import Cursos from '../components/react-components/Courses'
import Header from '../components/react-components/Header'
import Page from '../components/react-components/Page'
import Title from '@/components/react-components/Title'
import Filter from '@/components/react-components/Filter'
import { Toaster } from '@/components/ui/toaster'

export default function HomePage () {
  return (
    <Page>
      <Header/>
      <Main>
        <Title title='Cursos' filter={<Filter/>}/>
        <Cursos/>
        <Toaster />
      </Main>
    </Page>
  )
}

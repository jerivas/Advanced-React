import Header from './Header'
import Nav from './Nav'

export default function Page({ children }) {
    return <div>
        <Header />
        <Nav />
        {children}
    </div>
}
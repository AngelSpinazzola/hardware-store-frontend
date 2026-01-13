import NavBar from '@/components/Common/NavBar';
import Spinner from '@/components/Common/Spinner';

export default function ProductDetailLoading() {
    return (
        <div className="min-h-screen bg-white">
            <NavBar />
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
                <Spinner size="lg" />
            </div>
        </div>
    );
}

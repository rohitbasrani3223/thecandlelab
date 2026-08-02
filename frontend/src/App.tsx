import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { ToastProvider, DesignSystemShowcase } from './design-system';
import { Layout } from './components/layout';
import { HomePage } from './components/home';
import { AuthProvider } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';
import { AuthModal, AuthPage } from './components/auth';
import { BackToTopButton } from './components/common/BackToTopButton';
import { ProductGridSkeleton } from './components/common/ProductSkeleton';
import type { BlogPost } from './components/blog';
import { AdminLayout } from './components/admin';

// Dynamic Code Splitting Page Imports
const ShopPage = lazy(() => import('./components/shop').then((m) => ({ default: m.ShopPage })));
const ProductDetailsPage = lazy(() => import('./components/product').then((m) => ({ default: m.ProductDetailsPage })));
const CollectionsPage = lazy(() => import('./components/collections').then((m) => ({ default: m.CollectionsPage })));
const CategoriesPage = lazy(() => import('./components/categories').then((m) => ({ default: m.CategoriesPage })));
const BlogListingPage = lazy(() => import('./components/blog').then((m) => ({ default: m.BlogListingPage })));
const BlogDetailsPage = lazy(() => import('./components/blog').then((m) => ({ default: m.BlogDetailsPage })));
const AboutPage = lazy(() => import('./components/cms').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/cms').then((m) => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./components/cms').then((m) => ({ default: m.FAQPage })));
const LegalPage = lazy(() => import('./components/cms').then((m) => ({ default: m.LegalPage })));
const CareersPage = lazy(() => import('./components/cms').then((m) => ({ default: m.CareersPage })));
const WishlistPage = lazy(() => import('./components/wishlist').then((m) => ({ default: m.WishlistPage })));
const FullCartPage = lazy(() => import('./components/cart').then((m) => ({ default: m.FullCartPage })));
const CheckoutPage = lazy(() => import('./components/checkout').then((m) => ({ default: m.CheckoutPage })));
const AccountPage = lazy(() => import('./components/account').then((m) => ({ default: m.AccountPage })));

type Page = 'home' | 'shop' | 'collections' | 'categories' | 'blog' | 'blog-details' | 'pdp' | 'wishlist' | 'cart' | 'checkout' | 'account' | 'auth' | 'about' | 'contact' | 'faq' | 'privacy-policy' | 'terms-conditions' | 'shipping-policy' | 'refund-policy' | 'careers' | 'admin';

const VALID_PAGES: Page[] = ['home', 'shop', 'collections', 'categories', 'blog', 'blog-details', 'pdp', 'wishlist', 'cart', 'checkout', 'account', 'auth', 'about', 'contact', 'faq', 'privacy-policy', 'terms-conditions', 'shipping-policy', 'refund-policy', 'careers', 'admin'];

const getPageFromHash = (): Page => {
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith('/admin')) {
    return 'admin';
  }
  const rawHash = window.location.hash.replace('#', '').trim().toLowerCase();
  const hash = rawHash.split('?')[0];
  if (hash.startsWith('admin')) {
    return 'admin';
  }
  if (VALID_PAGES.includes(hash as Page)) {
    return hash as Page;
  }
  return 'home';
};

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash);
  const [selectedProduct, setSelectedProduct] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('tcl_selected_product');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(() => {
    try {
      const saved = localStorage.getItem('tcl_selected_article');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showDesignSystem, setShowDesignSystem] = useState(false);

  // Sync state with browser URL Hash and back/forward buttons (popstate)
  const syncPageWithUrl = useCallback(() => {
    const pageFromUrl = getPageFromHash();
    setCurrentPage(pageFromUrl);
  }, []);

  useEffect(() => {
    // Initial sync
    const initialPage = getPageFromHash();
    if (initialPage === 'home' && !window.location.hash) {
      window.history.replaceState({ page: 'home' }, '', '#home');
    } else if (initialPage === 'admin' && !window.location.hash) {
      window.history.replaceState({ page: 'admin' }, '', '#admin');
    }

    window.addEventListener('popstate', syncPageWithUrl);
    window.addEventListener('hashchange', syncPageWithUrl);

    return () => {
      window.removeEventListener('popstate', syncPageWithUrl);
      window.removeEventListener('hashchange', syncPageWithUrl);
    };
  }, [syncPageWithUrl]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.history.pushState({ page }, '', `#${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    try {
      localStorage.setItem('tcl_selected_product', JSON.stringify(product));
    } catch (e) {
      console.error('Failed to save selected product', e);
    }
    handleNavigate('pdp');
  };

  const handleSelectArticle = (article: BlogPost) => {
    setSelectedArticle(article);
    try {
      localStorage.setItem('tcl_selected_article', JSON.stringify(article));
    } catch (e) {
      console.error('Failed to save selected article', e);
    }
    handleNavigate('blog-details');
  };

  if (showDesignSystem) {
    return (
      <ToastProvider>
        <AuthProvider>
          <CMSProvider>
            <div className="bg-[#2A1E17] text-[#FAF6F0] p-3 text-center text-xs font-semibold flex items-center justify-center gap-4">
              <span>Design Tokens Showcase</span>
              <button
                onClick={() => setShowDesignSystem(false)}
                className="px-[#D4AF37] text-[#1C130E] font-bold rounded-xs px-3 py-1 cursor-pointer"
              >
                Return to App →
              </button>
            </div>
            <DesignSystemShowcase />
          </CMSProvider>
        </AuthProvider>
      </ToastProvider>
    );
  }

  if (currentPage === 'admin') {
    return (
      <ToastProvider>
        <AuthProvider>
          <CMSProvider>
            <AdminLayout onReturnToStore={() => handleNavigate('home')} />
          </CMSProvider>
        </AuthProvider>
      </ToastProvider>
    );
  }

  if (currentPage === 'checkout') {
    return (
      <ToastProvider>
        <AuthProvider>
          <CMSProvider>
            <AuthModal />
            <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-[#B88B38]">Loading Secure Checkout...</div>}>
              <CheckoutPage onReturnHome={() => handleNavigate('home')} />
            </Suspense>
          </CMSProvider>
        </AuthProvider>
      </ToastProvider>
    );
  }

  if (currentPage === 'auth') {
    return (
      <ToastProvider>
        <AuthProvider>
          <CMSProvider>
            <AuthPage onNavigateHome={() => handleNavigate('home')} />
          </CMSProvider>
        </AuthProvider>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AuthProvider>
        <CMSProvider>
          <AuthModal />
          <Layout
            currentPage={currentPage}
            onNavigate={(p) => handleNavigate(p as Page)}
          >
            <Suspense
              fallback={
                <div className="max-w-7xl mx-auto px-6 py-16 font-sans space-y-6">
                  <div className="text-center text-xs font-bold text-[#B88B38] uppercase tracking-widest animate-pulse">
                    Loading Sanctuary Atelier...
                  </div>
                  <ProductGridSkeleton count={6} />
                </div>
              }
            >
              {currentPage === 'account' ? (
                <AccountPage
                  onNavigateToWishlist={() => handleNavigate('wishlist')}
                  onNavigateToShop={() => handleNavigate('shop')}
                />
              ) : currentPage === 'cart' ? (
                <FullCartPage
                  onNavigateToShop={() => handleNavigate('shop')}
                  onNavigateToCheckout={() => handleNavigate('checkout')}
                />
              ) : currentPage === 'wishlist' ? (
                <WishlistPage onNavigateToShop={() => handleNavigate('shop')} />
              ) : currentPage === 'collections' ? (
                <CollectionsPage onNavigateToShop={() => handleNavigate('shop')} />
              ) : currentPage === 'categories' ? (
                <CategoriesPage
                  onNavigateToShop={() => handleNavigate('shop')}
                  onSelectProduct={handleSelectProduct}
                />
              ) : currentPage === 'blog' ? (
                <BlogListingPage onSelectArticle={handleSelectArticle} />
              ) : currentPage === 'blog-details' ? (
                <BlogDetailsPage
                  article={selectedArticle}
                  onNavigateToBlog={() => handleNavigate('blog')}
                  onSelectArticle={handleSelectArticle}
                />
              ) : currentPage === 'about' ? (
                <AboutPage
                  onNavigateToShop={() => handleNavigate('shop')}
                  onNavigateToContact={() => handleNavigate('contact')}
                />
              ) : currentPage === 'contact' ? (
                <ContactPage onNavigateToFAQ={() => handleNavigate('faq')} />
              ) : currentPage === 'faq' ? (
                <FAQPage />
              ) : currentPage === 'privacy-policy' ? (
                <LegalPage type="privacy" />
              ) : currentPage === 'terms-conditions' ? (
                <LegalPage type="terms" />
              ) : currentPage === 'shipping-policy' ? (
                <LegalPage type="shipping" />
              ) : currentPage === 'refund-policy' ? (
                <LegalPage type="refund" />
              ) : currentPage === 'careers' ? (
                <CareersPage />
              ) : currentPage === 'pdp' ? (
                <ProductDetailsPage
                  product={selectedProduct}
                  onNavigateToShop={() => handleNavigate('shop')}
                />
              ) : currentPage === 'shop' ? (
                <ShopPage onSelectProduct={handleSelectProduct} />
              ) : (
                <HomePage
                  onNavigateToShop={() => handleNavigate('shop')}
                  onSelectProduct={handleSelectProduct}
                />
              )}
            </Suspense>
          </Layout>
          {/* Global Floating Back-to-Top Action Button */}
          <BackToTopButton />
        </CMSProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

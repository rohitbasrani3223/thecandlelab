import React, { useState } from 'react';
import {
  colors,
  spacing,
  breakpoints,
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Chip,
  CandleIcon,
  ShoppingBagIcon,
  HeartIcon,
  StarIcon,
  SearchIcon,
  UserIcon,
  FilterIcon,
  SparklesIcon,
  TrashIcon,
  SkeletonCard,
  EmptyState,
  useToast,
  Modal,
  Drawer,
  Dropdown,
} from './index';


export const DesignSystemShowcase: React.FC = () => {
  const { toast } = useToast();

  // State controls for interactive components
  const [activeTab, setActiveTab] = useState<'foundations' | 'components' | 'overlays'>('foundations');
  const [inputText, setInputText] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioState, setRadioState] = useState('gold');
  const [switchState, setSwitchState] = useState(true);
  const [selectedChips, setSelectedChips] = useState<string[]>(['Scented', 'Soy Wax']);
  
  // Overlay states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState<'right' | 'left' | 'bottom'>('right');

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2A1E17] font-sans pb-24">
      {/* Top Banner Header */}
      <header className="sticky top-0 z-30 bg-[#2A1E17] text-[#FAF6F0] border-b border-[#4A3B32] shadow-md py-5 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CandleIcon size={32} className="text-[#D4AF37]" />
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-wide text-[#FAF6F0]">THE CANDLE LAB</h1>
            <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-medium">
              Luxury Design System Foundations
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-[#1C130E] p-1 rounded-md border border-[#4A3B32]">
          <button
            onClick={() => setActiveTab('foundations')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${activeTab === 'foundations' ? 'bg-[#D4AF37] text-[#1C130E] shadow-sm' : 'text-[#E5D9C5] hover:text-white'}`}
          >
            Tokens & Foundations
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${activeTab === 'components' ? 'bg-[#D4AF37] text-[#1C130E] shadow-sm' : 'text-[#E5D9C5] hover:text-white'}`}
          >
            Core UI Components
          </button>
          <button
            onClick={() => setActiveTab('overlays')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${activeTab === 'overlays' ? 'bg-[#D4AF37] text-[#1C130E] shadow-sm' : 'text-[#E5D9C5] hover:text-white'}`}
          >
            Modals, Drawers & Toasts
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-12 pt-10 space-y-16">
        {/* ==================== TAB 1: FOUNDATIONS ==================== */}
        {activeTab === 'foundations' && (
          <>
            {/* 1. COLOR PALETTE */}
            <section className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Color Palette</h2>
                <p className="text-sm text-[#8C7A6B]">Luxury warm color palette with ivory, cream, beige, espresso, and gold accents.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                <ColorSwatch name="Ivory 100" hex={colors.ivory[100]} border />
                <ColorSwatch name="Cream 100" hex={colors.cream[100]} border />
                <ColorSwatch name="Beige 200" hex={colors.beige[200]} />
                <ColorSwatch name="Beige 400" hex={colors.beige[400]} />
                <ColorSwatch name="Brown 600" hex={colors.brown[600]} darkText={false} />
                <ColorSwatch name="Brown 800" hex={colors.brown[800]} darkText={false} />
                <ColorSwatch name="Brown 900 (Espresso)" hex={colors.brown[900]} darkText={false} />
                <ColorSwatch name="Gold 500 (Metallic)" hex={colors.gold[500]} />
                <ColorSwatch name="Gold 600" hex={colors.gold[600]} />
                <ColorSwatch name="Success Green" hex={colors.status.success.text} darkText={false} />
                <ColorSwatch name="Warning Amber" hex={colors.status.warning.text} darkText={false} />
                <ColorSwatch name="Error Crimson" hex={colors.status.error.text} darkText={false} />
              </div>

              {/* Gradients */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="h-20 rounded-2xl p-4 flex items-end justify-between shadow-card text-[#1C1217] font-bold text-xs tracking-wider uppercase" style={{ background: colors.gradients.babyPink }}>
                  <span>Baby Pink Gradient</span>
                  <span>#FFF6F8 → #FCD5E2</span>
                </div>
                <div className="h-20 rounded-2xl p-4 flex items-end justify-between shadow-card text-white font-bold text-xs tracking-wider uppercase" style={{ background: colors.gradients.roseGold }}>
                  <span>Rose Gold Gradient</span>
                  <span>#F9B8CA → #E66A8A</span>
                </div>
                <div className="h-20 rounded-2xl p-4 flex items-end justify-between border border-[#F5E8EE] shadow-card text-white font-bold text-xs tracking-wider uppercase" style={{ background: colors.gradients.velvetNoir }}>
                  <span>Velvet Noir Gradient</span>
                  <span>#2A1822 → #150A10</span>
                </div>
              </div>
            </section>

            {/* 2. TYPOGRAPHY */}
            <section className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Typography System</h2>
                <p className="text-sm text-[#8C7A6B]">Dual font system: Playfair Display for headers, Plus Jakarta Sans for UI text.</p>
              </div>

              <div className="space-y-4 bg-[#F4EFE6] p-6 rounded-md border border-[#E5D9C5]">
                <div>
                  <span className="text-xs uppercase font-semibold text-[#8C7A6B]">Playfair Display (5xl / 48px)</span>
                  <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#2A1E17]">The Luxury Candle Collection</h1>
                </div>
                <div>
                  <span className="text-xs uppercase font-semibold text-[#8C7A6B]">Cormorant Garamond Subheading (2xl / 24px)</span>
                  <p className="text-2xl font-accent-luxury italic text-[#69574A]">Hand-poured with pure soy wax and botanical essential oils.</p>
                </div>
                <div>
                  <span className="text-xs uppercase font-semibold text-[#8C7A6B]">Plus Jakarta Sans Body Text (base / 16px)</span>
                  <p className="text-base text-[#4A3B32] leading-relaxed">
                    Indulge in olfactory elegance with custom-blended scents crafted to evoke warmth, serenity, and timeless sophistication.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. SPACING & BREAKPOINTS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="border-b border-[#E5D9C5] pb-3">
                  <h2 className="text-xl font-serif font-bold text-[#2A1E17]">Spacing Scale (4px / 8px Grid)</h2>
                </div>
                <div className="flex items-end gap-2 bg-[#F4EFE6] p-4 rounded-md border border-[#E5D9C5] overflow-x-auto">
                  {Object.entries(spacing).slice(1, 10).map(([key, val]) => (
                    <div key={key} className="flex flex-col items-center gap-1">
                      <div className="bg-[#D4AF37] rounded-xs" style={{ width: val, height: val }} />
                      <span className="text-[10px] text-[#8C7A6B] font-mono">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b border-[#E5D9C5] pb-3">
                  <h2 className="text-xl font-serif font-bold text-[#2A1E17]">Breakpoints Scale</h2>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {Object.entries(breakpoints).map(([bp, size]) => (
                    <div key={bp} className="p-3 bg-[#F4EFE6] border border-[#E5D9C5] rounded-md text-center">
                      <span className="font-bold text-[#2A1E17] block uppercase">{bp}</span>
                      <span className="text-[#8C7A6B]">{size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. SHADOWS & BORDER RADIUS */}
            <section className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Shadows & Border Radius</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#E5D9C5] shadow-card text-center text-xs font-semibold">
                  Card Shadow (Subtle)
                </div>
                <div className="p-6 bg-[#FAF6F0] rounded-md border border-[#E5D9C5] shadow-hover text-center text-xs font-semibold">
                  Hover Elevation Shadow
                </div>
                <div className="p-6 bg-[#FAF6F0] rounded-lg border border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.35)] text-center text-xs font-semibold text-[#8C6B0D]">
                  Gold Glow Shadow
                </div>
                <div className="p-6 bg-[#FAF6F0] rounded-full border border-[#E5D9C5] shadow-modal text-center text-xs font-semibold">
                  Pill Full Radius
                </div>
              </div>
            </section>
          </>
        )}

        {/* ==================== TAB 2: UI COMPONENTS ==================== */}
        {activeTab === 'components' && (
          <>
            {/* 1. BUTTONS */}
            <section className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Buttons</h2>
                <p className="text-sm text-[#8C7A6B]">Multiple luxury variants, sizes, loading states, and icon configurations.</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Primary Espresso</Button>
                <Button variant="gold" leftIcon={<SparklesIcon size={16} />}>Gold Luxury</Button>
                <Button variant="secondary">Secondary Ivory</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger" leftIcon={<TrashIcon size={16} />}>Danger</Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button variant="gold" size="sm">Small (32px)</Button>
                <Button variant="gold" size="md">Medium (40px)</Button>
                <Button variant="gold" size="lg">Large (48px)</Button>
                <Button variant="primary" isLoading>Loading State</Button>
                <Button variant="outline" disabled>Disabled State</Button>
              </div>
            </section>

            {/* 2. FORM INPUTS & SELECTS */}
            <section className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Form Controls & Inputs</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Standard Text Input"
                  placeholder="e.g. Velvet Rose Candle"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  leftIcon={<SearchIcon size={18} />}
                />
                <Input
                  label="Password Input (Reveal Toggle)"
                  type="password"
                  placeholder="Enter your secret key"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                />
                <Input
                  label="Input with Error State"
                  placeholder="invalid email"
                  error="Please enter a valid email address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Select Candle Fragrance"
                  options={[
                    { value: 'rose', label: 'Velvet Rose & Amber' },
                    { value: 'vanilla', label: 'French Bourbon Vanilla' },
                    { value: 'sandalwood', label: 'Mysore Sandalwood & Cedar' },
                    { value: 'citrus', label: 'Bergamot & Citrus Bloom' },
                  ]}
                />
                <Textarea label="Special Gift Instructions" placeholder="Add custom gold foil message..." />
              </div>

              {/* Checkbox, Radio, Switch */}
              <div className="flex flex-wrap items-center gap-8 bg-[#F4EFE6] p-6 rounded-md border border-[#E5D9C5]">
                <Checkbox
                  label="Include Gift Packaging"
                  description="Comes in a black velvet box with gold ribbon"
                  checked={checkboxState}
                  onChange={(e) => setCheckboxState(e.target.checked)}
                />
                <div className="flex items-center gap-4">
                  <Radio
                    label="Gold Foil"
                    name="finish"
                    checked={radioState === 'gold'}
                    onChange={() => setRadioState('gold')}
                  />
                  <Radio
                    label="Matte Black"
                    name="finish"
                    checked={radioState === 'black'}
                    onChange={() => setRadioState('black')}
                  />
                </div>
                <Switch
                  label="Auto Refill Monthly"
                  checked={switchState}
                  onChange={setSwitchState}
                />
              </div>
            </section>

            {/* 3. CARDS */}
            <section className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Cards</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card variant="bordered">
                  <CardHeader>
                    <h3 className="font-serif font-bold text-lg">Bordered Base Card</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-xs text-[#8C7A6B]">Clean container with subtle 1px beige border and soft background shadow.</p>
                  </CardBody>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <h3 className="font-serif font-bold text-lg text-[#2A1E17]">Elevated Hover Card</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-xs text-[#8C7A6B]">Elevates smoothly on hover with an expanded luxury shadow matrix.</p>
                  </CardBody>
                </Card>

                <Card variant="gold-border">
                  <CardHeader>
                    <h3 className="font-serif font-bold text-lg text-[#D4AF37]">Gold Luxury Card</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-xs text-[#8C7A6B]">Gold accent border with ambient gold glow shadow.</p>
                  </CardBody>
                  <CardFooter>
                    <span className="text-xs font-bold text-[#D4AF37]">$89.00</span>
                    <Button variant="gold" size="sm">Add to Cart</Button>
                  </CardFooter>
                </Card>
              </div>
            </section>

            {/* 4. BADGES & CHIPS */}
            <section className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Badges & Chips</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="gold" icon={<SparklesIcon size={12} />}>BEST SELLER</Badge>
                <Badge variant="espresso">NEW ARRIVAL</Badge>
                <Badge variant="success">IN STOCK</Badge>
                <Badge variant="warning">LIMITED EDITION</Badge>
                <Badge variant="error">OUT OF STOCK</Badge>
                <Badge variant="info">PRE-ORDER</Badge>
                <Badge variant="gold" pill>PILL BADGE</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {['Scented', 'Soy Wax', 'Hand-poured', 'Wood Wick', 'Luxury Jar'].map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    selected={selectedChips.includes(chip)}
                    onSelect={() => toggleChip(chip)}
                    onRemove={selectedChips.includes(chip) ? () => toggleChip(chip) : undefined}
                  />
                ))}
              </div>
            </section>

            {/* 5. ICONS */}
            <section className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Icon Library</h2>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 bg-[#F4EFE6] p-6 rounded-md border border-[#E5D9C5]">
                <IconBox icon={<CandleIcon size={24} className="text-[#D4AF37]" />} label="Candle" />
                <IconBox icon={<ShoppingBagIcon size={24} />} label="Bag" />
                <IconBox icon={<HeartIcon size={24} className="text-[#B33A3A]" />} label="Heart" />
                <IconBox icon={<StarIcon size={24} className="text-[#D4AF37]" />} label="Star" />
                <IconBox icon={<SearchIcon size={24} />} label="Search" />
                <IconBox icon={<UserIcon size={24} />} label="User" />
                <IconBox icon={<FilterIcon size={24} />} label="Filter" />
                <IconBox icon={<SparklesIcon size={24} className="text-[#D4AF37]" />} label="Sparkles" />
              </div>
            </section>

            {/* 6. LOADING SKELETONS & EMPTY STATES */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="border-b border-[#E5D9C5] pb-3">
                  <h2 className="text-xl font-serif font-bold text-[#2A1E17]">Loading Skeletons</h2>
                </div>
                <SkeletonCard />
              </div>

              <div className="space-y-4">
                <div className="border-b border-[#E5D9C5] pb-3">
                  <h2 className="text-xl font-serif font-bold text-[#2A1E17]">Empty State Component</h2>
                </div>
                <EmptyState
                  title="Your Wishlist is Empty"
                  description="Save your favorite hand-poured luxury candles to view them anytime."
                  actionLabel="Explore Collection"
                  onAction={() => toast({ type: 'luxury', title: 'Redirecting to Shop...' })}
                />
              </div>
            </section>
          </>
        )}

        {/* ==================== TAB 3: OVERLAYS ==================== */}
        {activeTab === 'overlays' && (
          <section className="space-y-12">
            {/* TOAST TRIGGERS */}
            <div className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Interactive Toasts</h2>
                <p className="text-sm text-[#8C7A6B]">Trigger pop-up notifications with auto-dismiss and luxury styling.</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="gold"
                  onClick={() => toast({ type: 'luxury', title: 'Candle Added to Cart', description: 'Velvet Rose & Amber Soy Candle ($89.00)' })}
                >
                  Trigger Gold Luxury Toast
                </Button>
                <Button
                  variant="primary"
                  onClick={() => toast({ type: 'success', title: 'Order Saved', description: 'Your cart configuration has been saved.' })}
                >
                  Trigger Success Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast({ type: 'warning', title: 'Stock Low', description: 'Only 3 left in stock for this batch.' })}
                >
                  Trigger Warning Toast
                </Button>
                <Button
                  variant="danger"
                  onClick={() => toast({ type: 'error', title: 'Payment Failed', description: 'Could not connect to payment gateway.' })}
                >
                  Trigger Error Toast
                </Button>
              </div>
            </div>

            {/* MODAL TRIGGER */}
            <div className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Modal Dialog</h2>
                <p className="text-sm text-[#8C7A6B]">Accessible overlay dialog with backdrop blur, keyboard ESC close, and scroll lock.</p>
              </div>

              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Sample Modal Dialog
              </Button>
            </div>

            {/* DRAWER TRIGGERS */}
            <div className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Side & Bottom Drawers</h2>
                <p className="text-sm text-[#8C7A6B]">Slide-out drawers for cart previews, mobile navigation, and product filters.</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDrawerPosition('right');
                    setIsDrawerOpen(true);
                  }}
                >
                  Open Right Cart Drawer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDrawerPosition('left');
                    setIsDrawerOpen(true);
                  }}
                >
                  Open Left Menu Drawer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDrawerPosition('bottom');
                    setIsDrawerOpen(true);
                  }}
                >
                  Open Bottom Sheet Drawer
                </Button>
              </div>
            </div>

            {/* DROPDOWN MENU */}
            <div className="space-y-6">
              <div className="border-b border-[#E5D9C5] pb-3">
                <h2 className="text-2xl font-serif font-bold text-[#2A1E17]">Dropdown Menu</h2>
              </div>

              <Dropdown
                trigger={<Button variant="outline">My Account Menu ▾</Button>}
                items={[
                  { key: 'profile', label: 'My Profile', icon: <UserIcon size={16} /> },
                  { key: 'orders', label: 'Order History', icon: <ShoppingBagIcon size={16} /> },
                  { key: 'wishlist', label: 'Saved Wishlist', icon: <HeartIcon size={16} /> },
                  'divider',
                  { key: 'logout', label: 'Sign Out', danger: true, onClick: () => toast({ type: 'info', title: 'Signed Out' }) },
                ]}
              />
            </div>
          </section>
        )}
      </main>

      {/* MODAL INSTANCE */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Custom Scent Blend Request"
        subtitle="Specify fragrance notes for your bespoke candle formulation"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="gold" onClick={() => { setIsModalOpen(false); toast({ type: 'luxury', title: 'Blend Request Submitted' }); }}>Submit Blend</Button>
          </>
        }
      >
        <div className="space-y-4 text-xs text-[#4A3B32]">
          <Input label="Blend Name" placeholder="e.g. Midnight Oud & Vanilla" />
          <Select
            label="Primary Essential Oil"
            options={[
              { value: 'oud', label: 'Cambodian Oud' },
              { value: 'rose', label: 'Damask Rose' },
              { value: 'bergamot', label: 'Italian Bergamot' },
            ]}
          />
          <Textarea label="Custom Notes for Master Perfumer" placeholder="Include extra wick specifications or gift box notes..." />
        </div>
      </Modal>

      {/* DRAWER INSTANCE */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position={drawerPosition}
        title={drawerPosition === 'right' ? 'Your Shopping Bag (2)' : drawerPosition === 'left' ? 'Navigation Menu' : 'Quick Filter'}
        footer={
          <Button variant="gold" fullWidth onClick={() => setIsDrawerOpen(false)}>
            {drawerPosition === 'right' ? 'Proceed to Checkout ($168.00)' : 'Apply Settings'}
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-[#8C7A6B]">
            Demonstrating smooth sliding drawer transitions with dark backdrop and keyboard support.
          </p>
          <SkeletonCard />
        </div>
      </Drawer>
    </div>
  );
};

const ColorSwatch: React.FC<{ name: string; hex: string; darkText?: boolean; border?: boolean }> = ({
  name,
  hex,
  darkText = true,
  border = false,
}) => (
  <div className={`p-3 rounded-md flex flex-col justify-between h-24 shadow-subtle ${border ? 'border border-[#E5D9C5]' : ''}`} style={{ backgroundColor: hex }}>
    <span className={`text-[10px] font-bold uppercase tracking-wider ${darkText ? 'text-[#2A1E17]' : 'text-[#FAF6F0]'}`}>{name}</span>
    <span className={`text-xs font-mono ${darkText ? 'text-[#4A3B32]' : 'text-[#E5D9C5]'}`}>{hex}</span>
  </div>
);

const IconBox: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-[#FAF6F0] rounded-md border border-[#E5D9C5] shadow-xs">
    {icon}
    <span className="text-[10px] text-[#8C7A6B] mt-1.5 font-medium">{label}</span>
  </div>
);

'use client';
import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown, 
  Car,
  BarChart3,
  Shield,
  Headphones,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Smartphone,
  Lock,
  ArrowLeft,
} from 'lucide-react';

interface PlanFeature {
  name: string;
  basic: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
  tooltip?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  period: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  gradient: string;
  popular?: boolean;
  features: string[];
  limits: {
    orders: string;
    users: string;
    storage: string;
  };
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  company?: string;
  address?: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    description: 'Ideal para pequenos lava-jatos iniciantes',
    price: 29.90,
    originalPrice: 49.90,
    period: 'mês',
    icon: Car,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
    features: [
      'Controle de pedidos básico',
      'Acompanhamento de status',
      'Dashboard simples',
    ],
    limits: {
      orders: '50 pedidos/mês',
      users: '1 usuário',
      storage: '1GB de armazenamento'
    }
  },
  {
    id: 'professional',
    name: 'Profissional',
    description: 'Para lava-jatos em crescimento',
    price: 79.90,
    originalPrice: 129.90,
    period: 'mês',
    icon: BarChart3,
    color: '#10B981',
    gradient: 'from-emerald-500 to-green-600',
    popular: true,
    features: [
      'Tudo do plano Básico',
      'Dashboard avançado com relatórios',
      'WhatsApp automático',
      'Controle de funcionários',
      'Relatórios em PDF',
    ],
    limits: {
      orders: '150 pedidos/mês',
      users: '2 usuários',
      storage: '10GB de armazenamento'
    }
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    description: 'Para redes e grandes operações',
    price: 149.90,
    originalPrice: 249.90,
    period: 'mês',
    icon: Crown,
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-violet-600',
    features: [
      'Tudo do plano Profissional',
      'Sistema de pagamentos (PIX/Cartão)',
      'Programa de fidelidade',
      'Agendamento online',
      'API para integrações',
      'Múltiplas unidades',
      'Suporte prioritário 24/7',
      'Treinamento personalizado'
    ],
    limits: {
      orders: 'Pedidos ilimitados',
      users: 'Usuários ilimitados',
      storage: '100GB de armazenamento'
    }
  }
];

const detailedFeatures: PlanFeature[] = [
  {
    name: 'Controle de Pedidos',
    basic: '100/mês',
    professional: '500/mês',
    enterprise: 'Ilimitado'
  },
  {
    name: 'Usuários',
    basic: '1',
    professional: '5',
    enterprise: 'Ilimitados'
  },
  {
    name: 'Dashboard & Relatórios',
    basic: 'Básico',
    professional: 'Avançado',
    enterprise: 'Completo + BI'
  },
  {
    name: 'WhatsApp Automático',
    basic: true,
    professional: true,
    enterprise: true
  },
  {
    name: 'Sistema de Pagamentos',
    basic: false,
    professional: false,
    enterprise: true
  },
  {
    name: 'Agendamento Online',
    basic: false,
    professional: false,
    enterprise: true
  },
  {
    name: 'Programa de Fidelidade',
    basic: false,
    professional: false,
    enterprise: true
  },
  {
    name: 'Múltiplas Unidades',
    basic: false,
    professional: false,
    enterprise: true
  },
  {
    name: 'API & Integrações',
    basic: false,
    professional: false,
    enterprise: true
  },
  {
    name: 'Suporte',
    basic: 'Email',
    professional: 'Chat + Email',
    enterprise: '24/7 Prioritário'
  }
];

const CheckoutModal: React.FC<{
  plan: Plan;
  isAnnual: boolean;
  onClose: () => void;
}> = ({ plan, isAnnual, onClose }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'debit' | null>(null);
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    company: '',
    address: {
      street: '',
      number: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const finalPrice = isAnnual ? plan.price * 10 : plan.price;
  const discount = isAnnual ? plan.price * 2 : 0;

  const handleCustomerDataChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setCustomerData(prev => ({
        ...prev,
        address: {
          ...prev.address!,
          [addressField]: value
        }
      }));
    } else {
      setCustomerData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const processPayment = async () => {
    setLoading(true);
    
    try {
      const paymentData = {
        customer: customerData,
        plan: plan.id,
        amount: finalPrice,
        payment_method: paymentMethod,
        period: isAnnual ? 'annual' : 'monthly'
      };

      console.log('Processando pagamento:', paymentData);

      await new Promise(resolve => setTimeout(resolve, 2000));

      if (paymentMethod === 'pix') {
        setStep(4); 
      } else {
        setStep(5); 
      }
    } catch (error) {
      console.error('Erro no pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Dados Pessoais</h2>
        <p className="text-gray-400">Preencha seus dados para continuar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo *</label>
          <input
            type="text"
            value={customerData.name}
            onChange={(e) => handleCustomerDataChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">E-mail *</label>
          <input
            type="email"
            value={customerData.email}
            onChange={(e) => handleCustomerDataChange('email', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Telefone *</label>
          <input
            type="tel"
            value={customerData.phone}
            onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="(11) 99999-9999"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">CPF *</label>
          <input
            type="text"
            value={customerData.cpf}
            onChange={(e) => handleCustomerDataChange('cpf', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="000.000.000-00"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Empresa (opcional)</label>
          <input
            type="text"
            value={customerData.company}
            onChange={(e) => handleCustomerDataChange('company', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Nome do seu lava-jato"
          />
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!customerData.name || !customerData.email || !customerData.phone || !customerData.cpf}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all"
      >
        Continuar
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Escolha o Pagamento</h2>
        <p className="text-gray-400">Selecione sua forma de pagamento preferida</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setPaymentMethod('pix')}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            paymentMethod === 'pix'
              ? 'border-green-500 bg-green-500/10'
              : 'border-white/20 bg-white/5 hover:border-white/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">PIX</h3>
              <p className="text-gray-400 text-sm">Pagamento instantâneo</p>
            </div>
            <div className="ml-auto">
              <span className="text-green-400 font-semibold">Sem taxas</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => setPaymentMethod('credit')}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            paymentMethod === 'credit'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-white/20 bg-white/5 hover:border-white/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Cartão de Crédito</h3>
              <p className="text-gray-400 text-sm">Parcele em até 12x</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setPaymentMethod('debit')}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            paymentMethod === 'debit'
              ? 'border-purple-500 bg-purple-500/10'
              : 'border-white/20 bg-white/5 hover:border-white/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Cartão de Débito</h3>
              <p className="text-gray-400 text-sm">Débito à vista</p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
        >
          Voltar
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!paymentMethod}
          className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          Continuar
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Confirmar Pedido</h2>
        <p className="text-gray-400">Revise os dados antes de finalizar</p>
      </div>

      <div className="bg-white/5 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Plano:</span>
          <span className="text-white font-semibold">{plan.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Período:</span>
          <span className="text-white">{isAnnual ? 'Anual' : 'Mensal'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Subtotal:</span>
          <span className="text-white">R$ {(isAnnual ? plan.price * 12 : plan.price).toFixed(2).replace('.', ',')}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Desconto:</span>
            <span className="text-green-400">-R$ {discount.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        <hr className="border-white/10" />
        <div className="flex justify-between items-center text-lg">
          <span className="text-white font-semibold">Total:</span>
          <span className="text-white font-bold">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">Dados do Cliente:</h3>
        <div className="space-y-1 text-sm">
          <p className="text-gray-300">{customerData.name}</p>
          <p className="text-gray-300">{customerData.email}</p>
          <p className="text-gray-300">{customerData.phone}</p>
          {customerData.company && <p className="text-gray-300">{customerData.company}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Lock className="w-4 h-4" />
        <span>Pagamento 100% seguro e criptografado</span>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
        >
          Voltar
        </button>
        <button
          onClick={processPayment}
          disabled={loading}
          className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Finalizar Pagamento'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Pagamento PIX</h2>
        <p className="text-gray-400">Escaneie o QR Code ou copie o código PIX</p>
      </div>

      <div className="bg-white p-8 rounded-lg mx-auto max-w-xs">
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-sm">QR Code PIX</span>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-4">
        <p className="text-gray-300 text-sm mb-2">Código PIX:</p>
        <div className="bg-white/10 p-3 rounded border break-all text-white font-mono text-sm">
          00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-426614174000
        </div>
        <button className="mt-2 text-blue-400 hover:text-blue-300 text-sm">
          Copiar código
        </button>
      </div>

      <div className="text-sm text-gray-400">
        <p>• O pagamento será confirmado automaticamente</p>
        <p>• Válido por 30 minutos</p>
        <p>• Valor: R$ {finalPrice.toFixed(2).replace('.', ',')}</p>
      </div>

      <button
        onClick={() => setStep(5)}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold"
      >
        Simular Pagamento Confirmado
      </button>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
        <Check className="w-10 h-10 text-white" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Pagamento Confirmado!</h2>
        <p className="text-gray-400">Seu plano foi ativado com sucesso</p>
      </div>

      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Próximos Passos:</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
            <span className="text-gray-300">Enviamos as credenciais de acesso para seu e-mail</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
            <span className="text-gray-300">Acesse a plataforma e configure seu lava-jato</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
            <span className="text-gray-300">Nossa equipe entrará em contato para ajudar na configuração</span>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold"
      >
        Fechar
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">Checkout - {plan.name}</h1>
          </div>
          <div className="text-sm text-gray-400">
            Etapa {step} de 5
          </div>
        </div>

        <div className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>
      </div>
    </div>
  );
};

const PricingPlans: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const getDiscountedPrice = (price: number) => {
    return isAnnual ? price * 10 : price; 
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const redirectToWhatsApp = (plan: Plan) => {
    const message = `Olá! Tenho interesse no plano *${plan.name}* (${plan.period}) no valor de R$ ${plan.price.toFixed(2).replace('.', ',')}.\n\nPor favor, me envie mais informações.`;
    const url = `https://wa.me/5531985201743?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <div className="relative overflow-hidden flex-grow">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
      <div className="relative container mx-auto px-4 py-16">
        
        <div className="text-center mb-16">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-400 tracking-wide">
          Bem-vindo ao <span className="text-white">CarFlow</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">A plataforma inteligente para lava-jatos modernos 🚗✨</p>
      </div>

      <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-4 py-2 mb-6">
        <Zap className="w-4 h-4 text-yellow-400" />
        <span className="text-sm text-blue-200 font-medium">🔥 Promoção de Lançamento - 40% OFF</span>
      </div>

      <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
        Escolha o Plano
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Ideal</span>
      </h2>

      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        Transforme seu lava-jato com nossa plataforma completa. Gerencie pedidos, clientes e pagamentos em um só lugar.
      </p>

      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Mensal</span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative w-16 h-8 bg-gray-700 rounded-full transition-colors"
        >
          <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-8' : ''}`} />
        </button>
        <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
          Anual 
          <span className="ml-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">-17%</span>
        </span>
      </div>
    </div>


        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const finalPrice = getDiscountedPrice(plan.price);

            return (
              <div
                key={plan.id}
                className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:bg-white/10 ${
                  plan.popular 
                    ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/20' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Mais Popular
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${plan.gradient} mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    {plan.originalPrice && (
                      <div className="text-gray-500 line-through text-lg mb-1">
                        R$ {getDiscountedPrice(plan.originalPrice).toFixed(2).replace('.', ',')}
                      </div>
                    )}
                    <div className="text-4xl font-bold text-white">
                      R$ {finalPrice.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-sm text-gray-400">por {plan.period}</div>
                  </div>

                  <ul className="text-left space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-white text-sm">
                        <Check className="w-4 h-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                    >
                      Escolher Plano
                    </button>
                    <button
                      onClick={() => redirectToWhatsApp(plan)}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                    >
                      Falar no WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mb-12">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg font-semibold rounded-full shadow-lg transition-all duration-200"
          >
            {showComparison ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            {showComparison ? 'Ocultar Comparação de Planos' : 'Comparar Planos'}
          </button>
        </div>


        {showComparison && (
          <div className="overflow-x-auto mt-8 border-t border-white/10 pt-8 mb-20">
            <table className="min-w-full text-sm text-left text-gray-400">
              <thead>
                <tr>
                  <th className="px-4 py-2"></th>
                  <th className="px-4 py-2 text-white">Básico</th>
                  <th className="px-4 py-2 text-white">Profissional</th>
                  <th className="px-4 py-2 text-white">Empresarial</th>
                </tr>
              </thead>
              <tbody>
                {detailedFeatures.map((feature, idx) => (
                  <tr key={idx} className="border-t border-white/5">
                    <td className="px-4 py-3 font-medium">{feature.name}</td>
                    <td className="px-4 py-3">
                      {typeof feature.basic === 'boolean' ? (
                        feature.basic ? <Check className="text-green-400 w-4 h-4" /> : <X className="text-red-400 w-4 h-4" />
                      ) : feature.basic}
                    </td>
                    <td className="px-4 py-3">
                      {typeof feature.professional === 'boolean' ? (
                        feature.professional ? <Check className="text-green-400 w-4 h-4" /> : <X className="text-red-400 w-4 h-4" />
                      ) : feature.professional}
                    </td>
                    <td className="px-4 py-3">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? <Check className="text-green-400 w-4 h-4" /> : <X className="text-red-400 w-4 h-4" />
                      ) : feature.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-bold text-white">Garantia de 30 dias</h3>
            </div>
            <p className="text-gray-300">
              Experimente sem riscos. Se não ficar satisfeito, devolvemos 100% do seu dinheiro em até 30 dias.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Headphones className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Suporte especializado</h3>
            </div>
            <p className="text-gray-300">
              Nossa equipe está pronta para ajudar você a configurar e otimizar seu lava-jato.
            </p>
          </div>
        </div>

        <div className="text-center mb-20">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Pronto para revolucionar seu lava-jato?
            </h3>
            <p className="text-gray-300 mb-6">
              Junte-se a centenas de lava-jatos que já aumentaram sua produtividade em até 300%
            </p>
            <button
              onClick={() => redirectToWhatsApp(plans.find(p => p.id === 'professional')!)}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/25"
            >
              Começar Teste Grátis de 07 dias
            </button>
          </div>
        </div>
      </div>
    </div>

    {showCheckout && selectedPlan && (
      <CheckoutModal
        plan={selectedPlan}
        isAnnual={isAnnual}
        onClose={() => setShowCheckout(false)}
      />
    )}

    <footer className="text-center py-6 text-gray-400 text-sm border-t border-white/10 bg-slate-950">
     CarFlow - Um Sistema Saas - Desenvolvido por @Schema Desenvolvimento Web 2025
    </footer>
  </div>
  );
  
};

export default PricingPlans;
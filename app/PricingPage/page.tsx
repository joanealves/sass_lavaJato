
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
  ChevronUp
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
  icon: React.ComponentType<any>;
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

const PricingPlans: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getDiscountedPrice = (price: number) => {
    return isAnnual ? price * 10 : price; 
  };

  const redirectToWhatsApp = (plan: Plan) => {
  const message = `Olá! Tenho interesse no plano *${plan.name}* (${plan.period}) no valor de R$ ${plan.price.toFixed(2).replace('.', ',')}.\n\nPor favor, me envie mais informações.`;
  const url = `https://wa.me/5531985201743?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-12">
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

            <div className="flex items-center justify-center gap-4 mb-12">
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

          <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                          R$ {plan.originalPrice.toFixed(2).replace('.', ',')}
                        </div>
                      )}
                      <div className="text-4xl font-bold text-white">
                        R$ {finalPrice.toFixed(2).replace('.', ',')}
                        <span className="text-lg text-gray-400 font-normal">/{plan.period}</span>
                      </div>
                      {isAnnual && (
                        <div className="text-green-400 text-sm mt-1">
                          Economize R$ {(plan.price * 2).toFixed(2).replace('.', ',')} por ano
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => redirectToWhatsApp(plan)}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all mb-8 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25'
                          : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
                      }`}
                    >
                      Falar no WhatsApp
                    </button>


                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Pedidos:</span>
                        <span className="text-white font-medium">{plan.limits.orders}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Usuários:</span>
                        <span className="text-white font-medium">{plan.limits.users}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Storage:</span>
                        <span className="text-white font-medium">{plan.limits.storage}</span>
                      </div>
                    </div>

                    <div className="text-left space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mb-8">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
            >
              <span className="text-lg font-medium">Comparar todos os recursos</span>
              {showComparison ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showComparison && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Comparação Completa</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 text-white font-medium">Recursos</th>
                      <th className="text-center py-4 text-white font-medium">Básico</th>
                      <th className="text-center py-4 text-white font-medium">Profissional</th>
                      <th className="text-center py-4 text-white font-medium">Empresarial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedFeatures.map((feature, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-4 text-gray-300">{feature.name}</td>
                        <td className="py-4 text-center">
                          {typeof feature.basic === 'boolean' ? (
                            feature.basic ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-white">{feature.basic}</span>
                          )}
                        </td>
                        <td className="py-4 text-center">
                          {typeof feature.professional === 'boolean' ? (
                            feature.professional ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-white">{feature.professional}</span>
                          )}
                        </td>
                        <td className="py-4 text-center">
                          {typeof feature.enterprise === 'boolean' ? (
                            feature.enterprise ? (
                              <Check className="w-5 h-5 text-green-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-400 mx-auto" />
                            )
                          ) : (
                            <span className="text-white">{feature.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-16">
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

          <div className="text-center">
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
    </div>
  );
};

export default PricingPlans;
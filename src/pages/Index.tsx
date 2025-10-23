import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  password: string;
  balance: number;
  donateBalance: number;
  achievements: string[];
  businesses: number;
  houses: number;
  cars: number;
}

const ACHIEVEMENTS = [
  { name: 'Первый капитал', threshold: 100000, icon: 'Trophy' },
  { name: 'Старший барон', threshold: 1000000, icon: 'Crown' },
  { name: 'Бизнесман', threshold: 10000000, icon: 'Briefcase' },
  { name: 'Legend', threshold: 100000000, icon: 'Award' }
];

export default function Index() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('gamesplut_users');
    const savedCurrentUser = localStorage.getItem('gamesplut_current_user');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
      setShowIntro(false);
    }

    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gamesplut_current_user', JSON.stringify(currentUser));
      const updatedUsers = users.map(u => u.id === currentUser.id ? currentUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('gamesplut_users', JSON.stringify(updatedUsers));
    }
  }, [currentUser]);

  const handleAuth = () => {
    if (!username || !password) {
      toast.error('Заполните все поля');
      return;
    }

    if (isLogin) {
      const user = users.find(u => u.username === username && u.password === password);
      
      if (username === 'plutka' && password === '1939') {
        const adminUser: User = {
          id: 0,
          username: 'plutka',
          password: '1939',
          balance: 999999999,
          donateBalance: 999999,
          achievements: ['Первый капитал', 'Старший барон', 'Бизнесман', 'Legend'],
          businesses: 100,
          houses: 50,
          cars: 25
        };
        setCurrentUser(adminUser);
        toast.success('Добро пожаловать, Admin!');
      } else if (user) {
        setCurrentUser(user);
        toast.success(`Добро пожаловать, ${user.username}!`);
      } else {
        toast.error('Неверный логин или пароль');
      }
    } else {
      if (users.find(u => u.username === username)) {
        toast.error('Такой ник уже занят');
        return;
      }

      const newUser: User = {
        id: users.length + 1,
        username,
        password,
        balance: 0,
        donateBalance: 0,
        achievements: [],
        businesses: 0,
        houses: 0,
        cars: 0
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('gamesplut_users', JSON.stringify(updatedUsers));
      setCurrentUser(newUser);
      toast.success('Регистрация успешна!');
    }

    setUsername('');
    setPassword('');
  };

  const handleClick = () => {
    if (!currentUser) return;

    const newBalance = currentUser.balance + 100;
    const updatedUser = { ...currentUser, balance: newBalance };

    ACHIEVEMENTS.forEach(achievement => {
      if (newBalance >= achievement.threshold && !currentUser.achievements.includes(achievement.name)) {
        updatedUser.achievements = [...updatedUser.achievements, achievement.name];
        toast.success(`🏆 Достижение: ${achievement.name}!`, {
          duration: 5000
        });
      }
    });

    setCurrentUser(updatedUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gamesplut_current_user');
    toast.info('Вы вышли из аккаунта');
  };

  const buyBusiness = () => {
    if (!currentUser) return;
    const cost = 50000 * (currentUser.businesses + 1);
    
    if (currentUser.balance >= cost) {
      setCurrentUser({
        ...currentUser,
        balance: currentUser.balance - cost,
        businesses: currentUser.businesses + 1
      });
      toast.success(`Бизнес куплен за ${cost.toLocaleString()}!`);
    } else {
      toast.error('Недостаточно средств');
    }
  };

  const buyHouse = () => {
    if (!currentUser) return;
    const cost = 100000 * (currentUser.houses + 1);
    
    if (currentUser.balance >= cost) {
      setCurrentUser({
        ...currentUser,
        balance: currentUser.balance - cost,
        houses: currentUser.houses + 1
      });
      toast.success(`Дом куплен за ${cost.toLocaleString()}!`);
    } else {
      toast.error('Недостаточно средств');
    }
  };

  const buyCar = () => {
    if (!currentUser) return;
    const cost = 75000 * (currentUser.cars + 1);
    
    if (currentUser.balance >= cost) {
      setCurrentUser({
        ...currentUser,
        balance: currentUser.balance - cost,
        cars: currentUser.cars + 1
      });
      toast.success(`Машина куплена за ${cost.toLocaleString()}!`);
    } else {
      toast.error('Недостаточно средств');
    }
  };

  const playCasino = () => {
    if (!currentUser) return;
    const bet = 10000;
    
    if (currentUser.balance < bet) {
      toast.error('Недостаточно средств (нужно 10,000)');
      return;
    }

    const random = Math.random();
    const win = random > 0.5;
    const amount = win ? bet * 2 : -bet;

    setCurrentUser({
      ...currentUser,
      balance: currentUser.balance + amount
    });

    if (win) {
      toast.success(`🎰 Выигрыш! +${bet.toLocaleString()}`);
    } else {
      toast.error(`🎰 Проигрыш! -${bet.toLocaleString()}`);
    }
  };

  const playRace = () => {
    if (!currentUser) return;
    const bet = 15000;
    
    if (currentUser.balance < bet) {
      toast.error('Недостаточно средств (нужно 15,000)');
      return;
    }

    const random = Math.random();
    const win = random > 0.6;
    const amount = win ? bet * 3 : -bet;

    setCurrentUser({
      ...currentUser,
      balance: currentUser.balance + amount
    });

    if (win) {
      toast.success(`🏁 Победа в гонке! +${(bet * 2).toLocaleString()}`);
    } else {
      toast.error(`🏁 Проигрыш! -${bet.toLocaleString()}`);
    }
  };

  const playBoxing = () => {
    if (!currentUser) return;
    const bet = 20000;
    
    if (currentUser.balance < bet) {
      toast.error('Недостаточно средств (нужно 20,000)');
      return;
    }

    const random = Math.random();
    const win = random > 0.55;
    const amount = win ? bet * 2.5 : -bet;

    setCurrentUser({
      ...currentUser,
      balance: currentUser.balance + amount
    });

    if (win) {
      toast.success(`🥊 Нокаут! +${(bet * 1.5).toLocaleString()}`);
    } else {
      toast.error(`🥊 Поражение! -${bet.toLocaleString()}`);
    }
  };

  if (showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1A2E] via-[#0F3460] to-[#1A1A2E]">
        <div className="flex gap-4">
          {['G', 'A', 'M', 'E', 'S', 'P', 'L', 'U', 'T'].map((letter, index) => (
            <div
              key={index}
              className="text-7xl font-bold animate-letter-pop text-transparent bg-clip-text bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35]"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1A2E] via-[#0F3460] to-[#1A1A2E] p-4">
        <Card className="w-full max-w-md p-8 bg-card border-primary/20">
          <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35]">
            GAMESPLUT
          </h1>
          
          <div className="space-y-4">
            <Input
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-muted border-primary/30"
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-primary/30"
            />
            
            <Button 
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] hover:opacity-90 text-white font-bold"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-sm text-primary hover:underline"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] via-[#0F3460] to-[#1A1A2E] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35]">
            GAMESPLUT
          </h1>
          <Button onClick={handleLogout} variant="outline" className="border-primary/30">
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="clicker" className="space-y-6">
          <TabsList className="grid grid-cols-5 gap-2 bg-card/50 p-2">
            <TabsTrigger value="clicker" className="data-[state=active]:bg-primary">
              <Icon name="MousePointerClick" size={16} className="mr-2" />
              Кликер
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary">
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-primary">
              <Icon name="ShoppingBag" size={16} className="mr-2" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-primary">
              <Icon name="Gamepad2" size={16} className="mr-2" />
              Игры
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-primary">
              <Icon name="Trophy" size={16} className="mr-2" />
              Награды
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clicker" className="space-y-6">
            <Card className="p-8 text-center bg-card border-primary/20">
              <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-2">Баланс</p>
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF6B35]">
                  {currentUser.balance.toLocaleString()}
                </p>
              </div>

              <Button
                onClick={handleClick}
                size="lg"
                className="w-64 h-64 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#FF6B35] hover:scale-105 transition-transform text-2xl font-bold animate-pulse-glow"
              >
                <div className="flex flex-col items-center gap-4">
                  <Icon name="HandCoins" size={80} />
                  <span>КЛИКАЙ!</span>
                  <span className="text-xl">+100</span>
                </div>
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6 bg-card border-primary/20">
              <h2 className="text-2xl font-bold mb-6 text-primary">Профиль игрока</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Баланс</p>
                  <p className="text-2xl font-bold text-[#FFD700]">{currentUser.balance.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Баланс доната</p>
                  <p className="text-2xl font-bold text-[#4ECDC4]">{currentUser.donateBalance.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="text-2xl font-bold">#{currentUser.id}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Ник</p>
                  <p className="text-2xl font-bold">{currentUser.username}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Building2" size={24} className="text-primary" />
                    <span className="font-medium">Бизнесы</span>
                  </div>
                  <Badge variant="secondary" className="text-lg">{currentUser.businesses}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Home" size={24} className="text-primary" />
                    <span className="font-medium">Дома</span>
                  </div>
                  <Badge variant="secondary" className="text-lg">{currentUser.houses}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Car" size={24} className="text-primary" />
                    <span className="font-medium">Машины</span>
                  </div>
                  <Badge variant="secondary" className="text-lg">{currentUser.cars}</Badge>
                </div>
              </div>

              {currentUser.achievements.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-lg font-bold mb-4">Достижения</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.achievements.map((achievement, index) => (
                      <Badge key={index} className="bg-gradient-to-r from-[#FFD700] to-[#FF6B35] text-white">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="shop" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card border-primary/20 hover:border-primary transition-colors">
                <div className="text-center mb-4">
                  <Icon name="Building2" size={48} className="mx-auto mb-3 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Бизнес</h3>
                  <p className="text-3xl font-bold text-[#FFD700] mb-2">
                    {(50000 * (currentUser.businesses + 1)).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">У вас: {currentUser.businesses}</p>
                </div>
                <Button onClick={buyBusiness} className="w-full bg-primary hover:bg-primary/90">
                  Купить
                </Button>
              </Card>

              <Card className="p-6 bg-card border-primary/20 hover:border-primary transition-colors">
                <div className="text-center mb-4">
                  <Icon name="Home" size={48} className="mx-auto mb-3 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Дом</h3>
                  <p className="text-3xl font-bold text-[#FFD700] mb-2">
                    {(100000 * (currentUser.houses + 1)).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">У вас: {currentUser.houses}</p>
                </div>
                <Button onClick={buyHouse} className="w-full bg-primary hover:bg-primary/90">
                  Купить
                </Button>
              </Card>

              <Card className="p-6 bg-card border-primary/20 hover:border-primary transition-colors">
                <div className="text-center mb-4">
                  <Icon name="Car" size={48} className="mx-auto mb-3 text-primary" />
                  <h3 className="text-xl font-bold mb-2">Машина</h3>
                  <p className="text-3xl font-bold text-[#FFD700] mb-2">
                    {(75000 * (currentUser.cars + 1)).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">У вас: {currentUser.cars}</p>
                </div>
                <Button onClick={buyCar} className="w-full bg-primary hover:bg-primary/90">
                  Купить
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card border-primary/20 hover:border-primary transition-colors">
                <div className="text-center mb-4">
                  <Icon name="Dices" size={48} className="mx-auto mb-3 text-[#FFD700]" />
                  <h3 className="text-xl font-bold mb-2">Казино</h3>
                  <p className="text-sm text-muted-foreground mb-2">Ставка: 10,000</p>
                  <p className="text-sm text-muted-foreground">Шанс: 50%</p>
                  <p className="text-sm text-primary font-bold">Выигрыш: x2</p>
                </div>
                <Button onClick={playCasino} className="w-full bg-gradient-to-r from-[#FFD700] to-[#FF6B35] hover:opacity-90">
                  Играть
                </Button>
              </Card>

              <Card className="p-6 bg-card border-primary/20 hover:border-primary transition-colors">
                <div className="text-center mb-4">
                  <Icon name="Car" size={48} className="mx-auto mb-3 text-[#4ECDC4]" />
                  <h3 className="text-xl font-bold mb-2">Гонки</h3>
                  <p className="text-sm text-muted-foreground mb-2">Ставка: 15,000</p>
                  <p className="text-sm text-muted-foreground">Шанс: 40%</p>
                  <p className="text-sm text-primary font-bold">Выигрыш: x3</p>
                </div>
                <Button onClick={playRace} className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#0F3460] hover:opacity-90">
                  Гонка
                </Button>
              </Card>

              <Card className="p-6 bg-card border-primary/20 hover:border-primary transition-colors">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">🥊</div>
                  <h3 className="text-xl font-bold mb-2">Бокс</h3>
                  <p className="text-sm text-muted-foreground mb-2">Ставка: 20,000</p>
                  <p className="text-sm text-muted-foreground">Шанс: 45%</p>
                  <p className="text-sm text-primary font-bold">Выигрыш: x2.5</p>
                </div>
                <Button onClick={playBoxing} className="w-full bg-gradient-to-r from-[#FF6B35] to-[#1A1A2E] hover:opacity-90">
                  В бой!
                </Button>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {ACHIEVEMENTS.map((achievement, index) => {
                const isUnlocked = currentUser.achievements.includes(achievement.name);
                const progress = Math.min((currentUser.balance / achievement.threshold) * 100, 100);
                
                return (
                  <Card key={index} className={`p-6 ${isUnlocked ? 'bg-gradient-to-br from-card to-primary/20 border-primary' : 'bg-card border-primary/20'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${isUnlocked ? 'bg-primary' : 'bg-muted'}`}>
                        <Icon name={achievement.icon as any} size={32} className={isUnlocked ? 'text-white' : 'text-muted-foreground'} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Достичь {achievement.threshold.toLocaleString()}
                        </p>
                        
                        {!isUnlocked && (
                          <div className="space-y-2">
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {progress.toFixed(1)}%
                            </p>
                          </div>
                        )}
                        
                        {isUnlocked && (
                          <Badge className="bg-[#FFD700] text-black font-bold">
                            ✓ Разблокировано
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

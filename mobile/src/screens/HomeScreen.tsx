import { useEffect, useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ActionButton } from '../components/ActionButton';
import { CarpoolCard } from '../components/CarpoolCard';
import { MarketplaceCard } from '../components/MarketplaceCard';
import { PostSheet } from '../components/PostSheet';
import { QuickLoginModal } from '../components/QuickLoginModal';
import { initialMessages } from '../data/demoData';
import {
  CreateCarpoolPostInput,
  CreateMarketplaceItemInput,
  createCarpoolPost,
  createMarketplaceItem,
  fetchCarpoolPosts,
  fetchMarketplaceItems,
  quickLogin,
  sendAgentMessage,
} from '../services/api';
import { CarpoolPost, ChatMessage, MarketplaceItem } from '../types/domain';

type Mode = 'carpool' | 'market';
type LoginProvider = 'phone' | 'google' | 'facebook';
type SessionUser = {
  id: string;
  displayName: string;
  trustLevel: number;
};

export function HomeScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('carpool');
  const [carpoolFeed, setCarpoolFeed] = useState<CarpoolPost[]>([]);
  const [marketFeed, setMarketFeed] = useState<MarketplaceItem[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [loginAction, setLoginAction] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [shouldOpenPostAfterLogin, setShouldOpenPostAfterLogin] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFeeds() {
      setIsLoadingFeed(true);
      const [carpool, market] = await Promise.all([fetchCarpoolPosts(), fetchMarketplaceItems()]);

      if (isMounted) {
        setCarpoolFeed(carpool);
        setMarketFeed(market);
        setIsLoadingFeed(false);
      }
    }

    void loadFeeds();

    return () => {
      isMounted = false;
    };
  }, []);

  const latestHint = useMemo(() => {
    if (mode === 'carpool') {
      return 'Nearby carpool posts use approximate areas to protect location privacy.';
    }

    return 'Second-hand listings are visible before login. Contacting a seller requires identity.';
  }, [mode]);

  function requireLogin(action: string) {
    if (user) {
      const assistantMessage: ChatMessage = {
        id: `auth-${Date.now()}`,
        role: 'assistant',
        text: `${action} is unlocked for ${user.displayName}. The next step will open the real workflow.`,
      };
      setMessages((current) => [...current, assistantMessage]);
      return;
    }

    setLoginAction(action);
    setIsLoginOpen(true);
  }

  function openPostFlow() {
    if (user) {
      setIsPostOpen(true);
      return;
    }

    setShouldOpenPostAfterLogin(true);
    setLoginAction('Posting');
    setIsLoginOpen(true);
  }

  async function handleQuickLogin(provider: LoginProvider) {
    setIsLoggingIn(true);
    const session = await quickLogin(provider);
    setUser(session.user);
    setIsLoggingIn(false);
    setIsLoginOpen(false);
    setShouldOpenPostAfterLogin(false);

    if (shouldOpenPostAfterLogin) {
      setIsPostOpen(true);
    }

    const assistantMessage: ChatMessage = {
      id: `login-${Date.now()}`,
      role: 'assistant',
      text: `You are signed in as ${session.user.displayName}. Trust level L${session.user.trustLevel} is now active.`,
    };
    setMessages((current) => [...current, assistantMessage]);
  }

  async function submitCarpoolPost(input: CreateCarpoolPostInput) {
    setIsPosting(true);
    const post = await createCarpoolPost(input);
    setCarpoolFeed((current) => [post, ...current]);
    setMode('carpool');
    setIsPosting(false);
    setIsPostOpen(false);

    const assistantMessage: ChatMessage = {
      id: `post-carpool-${Date.now()}`,
      role: 'assistant',
      text: `Your ${post.type === 'offer' ? 'ride offer' : 'ride request'} from ${post.fromArea} to ${post.toArea} is live. Exact pickup details stay hidden until confirmation.`,
    };
    setMessages((current) => [...current, assistantMessage]);
  }

  async function submitMarketplaceItem(input: CreateMarketplaceItemInput) {
    setIsPosting(true);
    const item = await createMarketplaceItem(input);
    setMarketFeed((current) => [item, ...current]);
    setMode('market');
    setIsPosting(false);
    setIsPostOpen(false);

    const assistantMessage: ChatMessage = {
      id: `post-market-${Date.now()}`,
      role: 'assistant',
      text: `${item.title} is now listed in the second-hand market. Buyers can browse it before login and must sign in before contacting you.`,
    };
    setMessages((current) => [...current, assistantMessage]);
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    setInput('');
    setIsSending(true);
    setMessages((current) => [...current, userMessage]);

    const response = await sendAgentMessage(trimmed);
    applyAgentIntent(response.intent, trimmed);

    const assistantMessage: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      text: response.reply,
    };

    setMessages((current) => [...current, assistantMessage]);
    setIsSending(false);
  }

  function applyAgentIntent(intent: string, text: string) {
    const normalized = text.toLowerCase();

    if (intent.startsWith('carpool') || normalized.includes('ride') || normalized.includes('carpool')) {
      setMode('carpool');
      return;
    }

    if (intent.startsWith('marketplace') || normalized.includes('sell') || normalized.includes('buy') || normalized.includes('iphone') || normalized.includes('bike')) {
      setMode('market');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.root}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>hiclaw</Text>
            <Text style={styles.subtitle}>{user ? `${user.displayName} | Trust L${user.trustLevel}` : 'Fast local agent'}</Text>
          </View>
          <Pressable style={styles.iconButton} onPress={() => requireLogin('Profile and trust features')}>
            <Ionicons name="person-circle" size={26} color="#25343F" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.chatPanel}>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                  <Text style={[styles.bubbleText, item.role === 'user' ? styles.userBubbleText : styles.assistantBubbleText]}>
                    {item.text}
                  </Text>
                </View>
              )}
            />
          </View>

          <View style={styles.actions}>
            <ActionButton icon="car-sport" label="Find ride" onPress={() => setMode('carpool')} />
            <ActionButton icon="add-circle" label="Post" onPress={openPostFlow} />
            <ActionButton icon="bag-handle" label="Market" onPress={() => setMode('market')} />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{mode === 'carpool' ? 'Nearby carpool' : 'Second-hand market'}</Text>
            <Text style={styles.sectionHint}>{latestHint}</Text>
          </View>

          <View style={styles.list}>
            {isLoadingFeed ? <Text style={styles.loadingText}>Loading nearby activity...</Text> : null}
            {!isLoadingFeed && mode === 'carpool'
              ? carpoolFeed.map((post) => <CarpoolCard key={post.id} post={post} onConfirm={() => requireLogin('Confirming a carpool')} />)
              : null}
            {!isLoadingFeed && mode === 'market'
              ? marketFeed.map((item) => <MarketplaceCard key={item.id} item={item} onContact={() => requireLogin('Contacting a seller')} />)
              : null}
          </View>
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask for a ride, item, or post..."
            placeholderTextColor="#7B8580"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <Pressable style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name={isSending ? 'hourglass' : 'send'} size={18} color="#FFFFFF" />
          </Pressable>
        </View>
        <QuickLoginModal
          action={loginAction}
          isVisible={isLoginOpen}
          isWorking={isLoggingIn}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleQuickLogin}
        />
        <PostSheet
          defaultMode={mode === 'carpool' ? 'carpool' : 'market'}
          isSubmitting={isPosting}
          isVisible={isPostOpen}
          onClose={() => setIsPostOpen(false)}
          onSubmitCarpool={submitCarpoolPost}
          onSubmitMarketplace={submitMarketplaceItem}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F4F2',
  },
  assistantBubbleText: {
    color: '#25343F',
  },
  brand: {
    color: '#16211D',
    fontSize: 27,
    fontWeight: '900',
  },
  bubble: {
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '88%',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatPanel: {
    minHeight: 116,
  },
  composer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E3E7E4',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  content: {
    gap: 16,
    padding: 16,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#EDF1F3',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  input: {
    backgroundColor: '#F4F7F5',
    borderColor: '#DEE5E1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#16211D',
    flex: 1,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  list: {
    gap: 12,
  },
  loadingText: {
    color: '#68726C',
    fontSize: 14,
    paddingVertical: 8,
  },
  root: {
    backgroundColor: '#FAFBF9',
    flex: 1,
  },
  safe: {
    backgroundColor: '#FAFBF9',
    flex: 1,
  },
  sectionHeader: {
    gap: 5,
  },
  sectionHint: {
    color: '#68726C',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    color: '#16211D',
    fontSize: 20,
    fontWeight: '900',
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#176B4D',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  subtitle: {
    color: '#69706C',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E3E7E4',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#176B4D',
  },
  userBubbleText: {
    color: '#FFFFFF',
  },
});

import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  AppState,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Switch,
  SafeAreaView,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SendIntentAndroid from 'react-native-send-intent';

const COLORS = {
  primary: '#fad02e',
  dark: '#1f1f1f',
  white: '#fff',
  lightGray: '#f5f5f5',
  borderGray: '#e0e0e0',
  textSecondary: '#999',
  darkCard: '#2a2a2a',
  darkInput: '#333',
  darkBorder: '#444',
  lightCard: '#FFF9E6',
  successGreen: '#00C853',
  lightRed: '#fee2e2',
  darkRed: '#b91c1c',
  cardBg: '#f8f8f8',
};

export default function SendMoneyApp() {
  const [paymentType, setPaymentType] = useState('phone');
  const [phone, setPhone] = useState('');
  const [merchantCode, setMerchantCode] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [spendingEnabled, setSpendingEnabled] = useState(true);
  const [currentTab, setCurrentTab] = useState('send');

  useEffect(() => {
    loadRecentTransactions();
    loadSettings();
  }, []);

  useEffect(() => {
    const handleAppStateChange = state => {
      if (state === 'active' && paymentCompleted && !lastTransaction) {
        const transaction = {
          id: `MPR${Date.now()}`,
          recipient: paymentType === 'phone' ? phone : merchantCode,
          amount: parseFloat(amount),
          type: paymentType === 'phone' ? 'Money Transfer' : 'Merchant Payment',
          timestamp: new Date().toLocaleString(),
          date: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          time: new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setLastTransaction(transaction);
        saveRecentTransaction(transaction);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentCompleted, lastTransaction]);

  const loadRecentTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem('recentTransactions');
      if (stored) {
        setRecentContacts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent transactions:', error);
    }
  };

  const saveRecentTransaction = async transaction => {
    try {
      let recent = [...recentContacts];
      const existingIndex = recent.findIndex(
        t => t.recipient === transaction.recipient,
      );
      if (existingIndex !== -1) {
        const existing = recent.splice(existingIndex, 1)[0];
        recent.unshift(existing);
      } else {
        recent.unshift(transaction);
      }
      recent = recent.slice(0, 10);
      setRecentContacts(recent);
      await AsyncStorage.setItem('recentTransactions', JSON.stringify(recent));
    } catch (error) {
      console.error('Error saving recent transaction:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const darkModeSaved = await AsyncStorage.getItem('darkMode');
      const spendingEnabledSaved = await AsyncStorage.getItem(
        'spendingEnabled',
      );
      if (darkModeSaved) {
        setDarkMode(JSON.parse(darkModeSaved));
      }
      if (spendingEnabledSaved) {
        setSpendingEnabled(JSON.parse(spendingEnabledSaved));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const toggleDarkMode = value => {
    setDarkMode(value);
    AsyncStorage.setItem('darkMode', JSON.stringify(value));
  };

  const toggleSpending = value => {
    setSpendingEnabled(value);
    AsyncStorage.setItem('spendingEnabled', JSON.stringify(value));
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      {
        text: 'Logout',
        onPress: () => {
          Alert.alert('Logged out', 'You have been logged out successfully');
          setShowSettings(false);
        },
        style: 'destructive',
      },
    ]);
  };

  const downloadReceipt = async () => {
    if (!lastTransaction) {
      return;
    }

    const receiptText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    MoMo Press - Transaction Receipt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Transaction Successful!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount Sent
RWF ${parseFloat(lastTransaction.amount).toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recipient: ${lastTransaction.recipient}
Type: ${lastTransaction.type}
Date: ${lastTransaction.date}
Time: ${lastTransaction.time}

Transaction ID: ${lastTransaction.id}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for using MoMo Press
Powered by MTN Mobile Money

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    try {
      await Share.share({
        message: receiptText,
        title: `Receipt - ${lastTransaction.id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share receipt');
    }
  };

  const validatePhoneNumber = phoneNum => {
    const cleanPhone = phoneNum.replace(/[\s-()\]]/g, '');
    const phoneRegex = /^\+?\d{10,15}$/;
    return phoneRegex.test(cleanPhone);
  };

  const validateMerchantCodeInput = code => {
    return code && code.length >= 4 && code.length <= 8 && /^\d+$/.test(code);
  };

  const validateAmountInput = amountVal => {
    return amountVal && parseFloat(amountVal) > 0;
  };

  const triggerUSSD = () => {
    if (paymentType === 'phone') {
      if (!phone) {
        Alert.alert('Missing Info', 'Please enter a phone number');
        return;
      }
      if (!validatePhoneNumber(phone)) {
        Alert.alert('Invalid Phone', 'Phone must be 10-15 digits');
        return;
      }
    } else if (!merchantCode) {
      Alert.alert('Missing Info', 'Please enter a merchant code');
      return;
    } else if (!validateMerchantCodeInput(merchantCode)) {
      Alert.alert('Invalid Code', 'Merchant code must be 4-8 digits');
      return;
    }

    if (!amount) {
      Alert.alert('Missing Info', 'Please enter an amount');
      return;
    }

    if (!validateAmountInput(amount)) {
      Alert.alert('Invalid Amount', 'Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);

      let ussdCode = '';
      if (paymentType === 'phone') {
        ussdCode = `*182*1*1*${phone}*${amount}#`;
      } else {
        ussdCode = `*182*8*1*${merchantCode}*${amount}#`;
      }

      console.log('Initiating USSD with code:', ussdCode);
      setPaymentCompleted(true);
      SendIntentAndroid.sendPhoneDial(ussdCode);
      setLoading(false);
    } catch (error) {
      console.error('USSD Error:', error);
      setPaymentCompleted(false);
      setLoading(false);
      Alert.alert(
        'Error',
        'Failed to initiate payment. Please ensure your device supports USSD calls.',
      );
    }
  };

  const resetPayment = () => {
    setPaymentCompleted(false);
    setLastTransaction(null);
    setPhone('');
    setMerchantCode('');
    setAmount('');
    setPaymentType('phone');
  };

  const fillFromRecent = transaction => {
    if (transaction.type === 'Money Transfer') {
      setPaymentType('phone');
      setPhone(transaction.recipient);
    } else {
      setPaymentType('merchant');
      setMerchantCode(transaction.recipient);
    }
    setAmount('');
  };

  const setQuickAmount = value => {
    setAmount(value.toString());
  };

  const backgroundColor = darkMode ? COLORS.dark : COLORS.lightGray;
  const textColor = darkMode ? COLORS.white : COLORS.dark;
  const cardBackgroundColor = darkMode ? COLORS.darkCard : COLORS.white;
  const inputBorderColor = darkMode ? COLORS.darkBorder : COLORS.borderGray;
  const cardBackground = darkMode ? COLORS.darkInput : COLORS.cardBg;
  const transactionIdBg = darkMode ? COLORS.darkInput : COLORS.lightCard;

  return (
    <SafeAreaView style={[styles.container, {backgroundColor}]}>
      <View style={styles.header}>
        <Text style={styles.mtnBadge}>m-press</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSettings}
        animationType="slide"
        transparent
        onRequestClose={() => setShowSettings(false)}>
        <View style={styles.settingsBackdrop}>
          <TouchableOpacity
            style={styles.settingsBackdropTouchable}
            onPress={() => setShowSettings(false)}
          />
          <View
            style={[
              styles.settingsModal,
              {backgroundColor: cardBackgroundColor},
            ]}>
            <View style={styles.settingsHeader}>
              <Text style={[styles.settingsTitle, {color: textColor}]}>
                Settings
              </Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Text style={styles.closeSettingsBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.settingsBody}>
              <View style={styles.featureGroup}>
                <View style={styles.featureTitleRow}>
                  <View style={styles.featureLabelContainer}>
                    <Text style={[styles.featureTitle, {color: textColor}]}>
                      Spending Breakdown
                    </Text>
                    <Text style={styles.featureDescription}>
                      Show detailed category spending analysis
                    </Text>
                  </View>
                  <Switch
                    value={spendingEnabled}
                    onValueChange={toggleSpending}
                    trackColor={{
                      false: COLORS.borderGray,
                      true: '#fbbf24',
                    }}
                    thumbColor={spendingEnabled ? COLORS.primary : COLORS.white}
                  />
                </View>
              </View>

              <View style={styles.featureGroup}>
                <View style={styles.featureTitleRow}>
                  <View style={styles.featureLabelContainer}>
                    <Text style={[styles.featureTitle, {color: textColor}]}>
                      Dark Mode
                    </Text>
                    <Text style={styles.featureDescription}>
                      Switch to dark theme
                    </Text>
                  </View>
                  <Switch
                    value={darkMode}
                    onValueChange={toggleDarkMode}
                    trackColor={{
                      false: COLORS.borderGray,
                      true: '#fbbf24',
                    }}
                    thumbColor={darkMode ? COLORS.primary : COLORS.white}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutBtnText}>🚪 Log out</Text>
              </TouchableOpacity>

              <View style={styles.aboutMoMo}>
                <Text style={[styles.aboutTitle, {color: textColor}]}>
                  MoMo Press v1.0
                </Text>
                <Text style={styles.aboutDesc}>
                  Track your MoMo spending and manage your finances
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.mainContent}>
        {lastTransaction ? (
          <ScrollView style={styles.scrollView}>
            <View style={styles.successContainer}>
              <View style={styles.successIconBg}>
                <View style={styles.successCheckmark}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              </View>

              <Text style={[styles.successTitle, {color: textColor}]}>
                Transaction Successful!
              </Text>
              <Text style={styles.successSubtitle}>
                Your money has been sent
              </Text>

              <View
                style={[
                  styles.transactionDetails,
                  {backgroundColor: cardBackgroundColor},
                ]}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount Sent</Text>
                  <Text style={styles.detailValueHighlight}>
                    RWF {parseFloat(lastTransaction.amount).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Recipient</Text>
                  <Text style={[styles.detailValue, {color: textColor}]}>
                    {lastTransaction.recipient}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text style={[styles.detailValue, {color: textColor}]}>
                    {lastTransaction.type}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date & Time</Text>
                  <Text style={[styles.detailValue, {color: textColor}]}>
                    {lastTransaction.date} {lastTransaction.time}
                  </Text>
                </View>

                <View
                  style={[
                    styles.transactionId,
                    {backgroundColor: transactionIdBg},
                  ]}>
                  <Text style={styles.idLabel}>Transaction ID</Text>
                  <Text style={[styles.idValue, {color: textColor}]}>
                    {lastTransaction.id}
                  </Text>
                </View>
              </View>

              <Text style={styles.confirmationText}>
                Thank you for using MoMo Press
              </Text>
              <Text style={styles.confirmationTextBottom}>
                Powered by MTN Mobile Money
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={downloadReceipt}>
                  <Text style={styles.downloadBtnText}>📥 Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.doneBtn} onPress={resetPayment}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.scrollView}>
            <View style={styles.pageHeader}>
              <Text style={[styles.pageTitle, {color: textColor}]}>
                Send Money
              </Text>
              <Text style={styles.pageSubtitle}>Quick & secure transfers</Text>
            </View>

            <View
              style={[styles.formCard, {backgroundColor: cardBackgroundColor}]}>
              <View style={styles.tabButtons}>
                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    paymentType === 'phone' && styles.tabBtnActive,
                  ]}
                  onPress={() => setPaymentType('phone')}>
                  <Text
                    style={[
                      styles.tabBtnText,
                      paymentType === 'phone' && styles.tabBtnTextActive,
                    ]}>
                    📱 Phone Number
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabBtn,
                    paymentType === 'merchant' && styles.tabBtnActive,
                  ]}
                  onPress={() => setPaymentType('merchant')}>
                  <Text
                    style={[
                      styles.tabBtnText,
                      paymentType === 'merchant' && styles.tabBtnTextActive,
                    ]}>
                    🏪 Merchant Code
                  </Text>
                </TouchableOpacity>
              </View>

              {paymentType === 'phone' && (
                <View style={styles.formGroup}>
                  <Text style={[styles.label, {color: textColor}]}>
                    Phone Number
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: textColor,
                        borderColor: inputBorderColor,
                      },
                    ]}
                    placeholder="078XXXXXXX or +250788XXXXXX"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={20}
                  />
                </View>
              )}

              {paymentType === 'merchant' && (
                <View style={styles.formGroup}>
                  <Text style={[styles.label, {color: textColor}]}>
                    Merchant Code
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: textColor,
                        borderColor: inputBorderColor,
                      },
                    ]}
                    placeholder="Enter 4-8 digit code"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                    value={merchantCode}
                    onChangeText={setMerchantCode}
                    maxLength={8}
                  />
                </View>
              )}

              <View style={styles.formGroup}>
                <Text style={[styles.label, {color: textColor}]}>
                  Amount (RWF)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: textColor,
                      borderColor: inputBorderColor,
                    },
                  ]}
                  placeholder="0"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              <Text style={styles.quickAmountLabel}>Quick Amounts</Text>
              <View style={styles.quickAmounts}>
                {[500, 1000, 2000, 5000, 10000, 20000].map(val => (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.amountBtn,
                      {
                        backgroundColor: cardBackground,
                        borderColor: inputBorderColor,
                      },
                    ]}
                    onPress={() => setQuickAmount(val)}>
                    <Text style={[styles.amountBtnText, {color: textColor}]}>
                      {val.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={triggerUSSD}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color={COLORS.dark} />
                ) : (
                  <Text style={styles.sendBtnText}>Send Money →</Text>
                )}
              </TouchableOpacity>
            </View>

            {recentContacts.length > 0 && (
              <View
                style={[
                  styles.recentSection,
                  {backgroundColor: cardBackgroundColor},
                ]}>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentHeaderText}>⏱ Recent</Text>
                </View>
                {recentContacts.map((contact, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.recentItem,
                      {backgroundColor: cardBackground},
                    ]}
                    onPress={() => fillFromRecent(contact)}>
                    <View style={styles.recentInfo}>
                      <Text style={[styles.recentName, {color: textColor}]}>
                        {contact.type === 'Money Transfer'
                          ? 'Phone Number'
                          : 'Merchant'}
                      </Text>
                      <Text style={styles.recentPhone}>
                        {contact.recipient}
                      </Text>
                    </View>
                    <View style={styles.contactBadge}>
                      <Text style={styles.badgeText}>Sent</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.bottomSpacing} />
          </ScrollView>
        )}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('home')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text
            style={[
              styles.navLabel,
              currentTab === 'home' && styles.navLabelActive,
            ]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('send')}>
          <Text style={styles.navIcon}>✈️</Text>
          <Text
            style={[
              styles.navLabel,
              currentTab === 'send' && styles.navLabelActive,
            ]}>
            Send
          </Text>
        </TouchableOpacity>
        {spendingEnabled && (
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentTab('spending')}>
            <Text style={styles.navIcon}>📊</Text>
            <Text
              style={[
                styles.navLabel,
                currentTab === 'spending' && styles.navLabelActive,
              ]}>
              Spending
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentTab('history')}>
          <Text style={styles.navIcon}>⏰</Text>
          <Text
            style={[
              styles.navLabel,
              currentTab === 'history' && styles.navLabelActive,
            ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollView: {flex: 1},
  mainContent: {flex: 1},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  mtnBadge: {
    fontSize: 12,
    fontWeight: '900',
    backgroundColor: COLORS.dark,
    color: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  settingsIcon: {fontSize: 24},
  settingsBackdrop: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  settingsBackdropTouchable: {flex: 1},
  settingsModal: {
    width: '80%',
    height: '100%',
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: -6, height: 0},
    shadowOpacity: 0.26,
    shadowRadius: 26,
    elevation: 10,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fde68a',
  },
  settingsTitle: {fontSize: 20, fontWeight: 'bold'},
  closeSettingsBtn: {fontSize: 22, color: '#fbbf24'},
  settingsBody: {flex: 1, paddingHorizontal: 24, paddingVertical: 20},
  featureGroup: {marginBottom: 40},
  featureTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureLabelContainer: {flex: 1, marginRight: 12},
  featureTitle: {fontSize: 18, fontWeight: '600', marginBottom: 4},
  featureDescription: {color: '#818181', fontSize: 13, marginTop: 2},
  logoutBtn: {
    backgroundColor: COLORS.lightRed,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: COLORS.darkRed,
    fontSize: 15,
    fontWeight: '600',
  },
  aboutMoMo: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  aboutTitle: {fontSize: 14, fontWeight: '600', marginBottom: 4},
  aboutDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  pageHeader: {paddingVertical: 24, paddingHorizontal: 20},
  pageTitle: {fontSize: 24, fontWeight: '600', marginBottom: 4},
  pageSubtitle: {fontSize: 14, color: COLORS.textSecondary},
  formCard: {
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButtons: {flexDirection: 'row', marginBottom: 24, gap: 12},
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
  },
  tabBtnActive: {backgroundColor: COLORS.primary},
  tabBtnText: {fontSize: 14, fontWeight: '600', color: '#666'},
  tabBtnTextActive: {color: COLORS.dark},
  formGroup: {marginBottom: 16},
  label: {fontSize: 14, fontWeight: '600', marginBottom: 8},
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  quickAmountLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 10,
    color: COLORS.textSecondary,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  amountBtn: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  amountBtnText: {fontSize: 14, fontWeight: '500'},
  sendBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  sendBtnText: {fontSize: 16, fontWeight: '600', color: COLORS.dark},
  recentSection: {
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recentHeader: {marginBottom: 16},
  recentHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  recentInfo: {flex: 1},
  recentName: {fontSize: 15, fontWeight: '600', marginBottom: 4},
  recentPhone: {fontSize: 13, color: COLORS.textSecondary},
  contactBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: COLORS.lightCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  badgeText: {fontSize: 12, fontWeight: '500', color: COLORS.dark},
  bottomSpacing: {height: 80},
  successContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  successIconBg: {marginBottom: 20},
  successCheckmark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 48,
    color: COLORS.successGreen,
    fontWeight: 'bold',
  },
  successTitle: {fontSize: 22, fontWeight: 'bold', marginBottom: 8},
  successSubtitle: {fontSize: 14, color: '#666', marginBottom: 24},
  transactionDetails: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  detailLabel: {fontSize: 14, color: COLORS.textSecondary},
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  detailValueHighlight: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'right',
  },
  divider: {height: 1, backgroundColor: '#f0f0f0', marginVertical: 8},
  transactionId: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  idLabel: {fontSize: 12, marginBottom: 6, color: COLORS.textSecondary},
  idValue: {fontSize: 15, fontWeight: '600', letterSpacing: 0.5},
  confirmationText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  confirmationTextBottom: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS.textSecondary,
  },
  modalActions: {flexDirection: 'row', gap: 12, marginTop: 20},
  downloadBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  downloadBtnText: {fontSize: 15, fontWeight: '600', color: COLORS.primary},
  doneBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  doneBtnText: {fontSize: 15, fontWeight: '600', color: COLORS.dark},
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {flex: 1, alignItems: 'center', paddingVertical: 8},
  navIcon: {fontSize: 20, marginBottom: 4},
  navLabel: {fontSize: 11, fontWeight: '500', color: COLORS.textSecondary},
  navLabelActive: {color: '#fbbf24', fontWeight: '600'},
});

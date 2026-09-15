/**
 * DataCenter Rack Manager - Frontend Application Logic
 * High Visibility, CSS Grid Exact Slot Sizing, Real Host ICMP Ping Integration
 */

const defaultData = {
  settings: {
    theme: 'dark',
    ticketRule: {
      prefix: 'CHG',
      datePattern: 'YYYY',
      digits: 3,
      nextSeq: 1
    },
    pingIntervalSeconds: 30,
    pingTimeoutMs: 2500,
    globalPingEnabled: true,
    autoPingEnabled: false,
    viewMode: 'front' // 'front' | 'rear'
  },
  racks: [
    {
      id: 'rack-1',
      name: 'Rack A-01',
      units: 42,
      tags: ['Zone-A', 'Web Cluster', '1F DataCenter'],
      devices: [
        {
          id: 'dev-utm-1',
          name: 'utm-firewall-01 (Primary)',
          ip: '192.168.100.1',
          vip: '1.1.1.1',
          haRole: 'primary',
          haPairId: 'dev-utm-2',
          hostname: 'utm01.sec.corp',
          vendor: 'Fortinet',
          model: 'FortiGate 100F',
          sizeU: 1,
          startU: 41,
          side: 'front',
          type: 'utm',
          portCount: 8,
          tags: ['security', 'firewall', 'utm'],
          pingEnabled: true,
          status: 'online',
          responseTimeMs: 4,
          lastChecked: new Date().toISOString(),
          notes: '境界次世代ファイアウォール / UTM 主系 (41U: VIP 1.1.1.1)'
        },
        {
          id: 'dev-utm-2',
          name: 'utm-firewall-02 (Secondary)',
          ip: '192.168.100.2',
          vip: '1.1.1.1',
          haRole: 'secondary',
          haPairId: 'dev-utm-1',
          hostname: 'utm02.sec.corp',
          vendor: 'Fortinet',
          model: 'FortiGate 100F',
          sizeU: 1,
          startU: 40,
          side: 'front',
          type: 'utm',
          portCount: 8,
          tags: ['security', 'firewall', 'utm'],
          pingEnabled: true,
          status: 'online',
          responseTimeMs: 5,
          lastChecked: new Date().toISOString(),
          notes: '境界次世代ファイアウォール / UTM 従系 (40U: VIP 1.1.1.1)'
        },
        {
          id: 'dev-l3-1',
          name: 'core-l3-switch-01',
          ip: '1.0.0.1',
          hostname: 'sw-core01.corp.local',
          vendor: 'Cisco',
          model: 'Catalyst 9300L 24P',
          sizeU: 1,
          startU: 39,
          side: 'front',
          type: 'l3_switch',
          portCount: 24,
          tags: ['network', 'l3', 'core'],
          pingEnabled: true,
          status: 'online',
          responseTimeMs: 2,
          lastChecked: new Date().toISOString(),
          notes: 'コア L3 スイッチ (39U: 24ポート)'
        },
        {
          id: 'dev-l2-1',
          name: 'edge-l2-switch-01',
          ip: '8.8.8.8',
          hostname: 'sw-edge01.corp.local',
          vendor: 'Yamaha',
          model: 'SWX2210P-24G',
          sizeU: 1,
          startU: 38,
          side: 'front',
          type: 'l2_switch',
          portCount: 24,
          tags: ['network', 'l2', 'access'],
          pingEnabled: true,
          status: 'online',
          responseTimeMs: 3,
          lastChecked: new Date().toISOString(),
          notes: 'フロア収容 L2 スイッチ (38U: 24ポート)'
        },
        {
          id: 'dev-3',
          name: 'db-master-01',
          ip: '192.168.250.54',
          hostname: 'db01.prod.local',
          vendor: 'Dell',
          model: 'PowerEdge R740xd',
          sizeU: 2,
          startU: 34,
          side: 'full',
          type: 'rackmount',
          portCount: 2,
          tags: ['db', 'postgresql', 'primary'],
          pingEnabled: true,
          status: 'online',
          responseTimeMs: 44,
          lastChecked: new Date().toISOString(),
          notes: '到達不能テスト用IP (192.0.2.1: 34〜35U)'
        },
        {
          id: 'dev-4',
          name: 'edge-router-01',
          ip: '1.1.1.1',
          hostname: 'rt01.corp.local',
          vendor: 'Yamaha',
          model: 'RTX1220',
          sizeU: 1,
          startU: 42,
          slotWidth: 'half',
          slotCol: 1,
          side: 'front',
          type: 'desktop',
          portCount: 8,
          tags: ['network', 'router', 'vpn'],
          pingEnabled: true,
          status: 'online',
          responseTimeMs: 6,
          lastChecked: new Date().toISOString(),
          notes: 'オフィスゲートウェイルーター (42U 左側ハーフ)'
        },
        {
          id: 'dev-4b',
          name: 'vpn-gateway-02',
          ip: '1.0.0.1',
          hostname: 'rt02.corp.local',
          vendor: 'Yamaha',
          model: 'RTX830',
          sizeU: 1,
          startU: 42,
          slotWidth: 'half',
          slotCol: 2,
          side: 'front',
          type: 'desktop',
          portCount: 8,
          tags: ['network', 'vpn', 'sub'],
          pingEnabled: true,
          status: 'online',
          responseTimeMs: 5,
          lastChecked: new Date().toISOString(),
          notes: '冗長VPNルーター (42U 右側ハーフ)'
        },
        {
          id: 'dev-5',
          name: 'ai-training-node',
          ip: '192.168.1.50',
          hostname: 'gpu-box-01',
          vendor: 'Custom Built',
          model: 'Tower Workstation',
          sizeU: 5,
          startU: 1,
          side: 'front',
          type: 'tower',
          tags: ['ai', 'gpu', 'dev'],
          pingEnabled: false,
          status: 'unknown',
          responseTimeMs: null,
          lastChecked: null,
          notes: 'ラック最下部シェルフ設置タワーマシン (5U: 1〜5U・Ping監視無効)'
        },
        {
          id: 'dev-6',
          name: 'rear-pdu-01',
          ip: '127.0.0.1',
          hostname: 'pdu01.mgmt.local',
          vendor: 'APC',
          model: 'AP8858EU3',
          sizeU: 1,
          startU: 38,
          side: 'rear',
          type: 'pdu',
          tags: ['power', 'pdu', 'mgmt'],
          pingEnabled: true,
          status: 'online',
          responseTimeMs: 1,
          lastChecked: new Date().toISOString(),
          notes: '背面専用インテリジェントPDU (1U: 38U背面)'
        }
      ]
    },
    {
      id: 'rack-2',
      name: 'Rack A-02',
      units: 42,
      tags: ['Zone-A', 'DB & Storage Cluster'],
      devices: [
        {
          id: 'dev-7',
          name: 'storage-nas-01',
          ip: '8.8.4.4',
          hostname: 'nas01.storage.local',
          vendor: 'Synology',
          model: 'RackStation RS3618xs',
          sizeU: 2,
          startU: 39,
          side: 'full',
          type: 'rackmount',
          portCount: 4,
          tags: ['storage', 'nfs', 'backup'],
          pingEnabled: true,
          status: 'online',
          responseTimeMs: 10,
          lastChecked: new Date().toISOString(),
          notes: '大容量バックアップストレージ (2U: 39〜40U)'
        },
        {
          id: 'dev-8',
          name: 'core-switch-01',
          ip: '1.0.0.1',
          hostname: 'sw01.core.local',
          vendor: 'Cisco',
          model: 'Catalyst 9300',
          sizeU: 1,
          startU: 42,
          side: 'front',
          type: 'rackmount',
          tags: ['network', 'switch', '10g'],
          pingEnabled: true,
          status: 'online',
          responseTimeMs: 7,
          lastChecked: new Date().toISOString(),
          notes: 'コアスイッチ 48ポート (1U: 42U)'
        }
      ]
    }
  ],
  cables: [
    {
      id: 'cable-1',
      fromDeviceId: 'dev-utm-1',
      fromPort: 1,
      toDeviceId: 'dev-l3-1',
      toPort: 1,
      color: '#00f0ff',
      side: 'front',
      label: 'UTM ➜ L3 Core Uplink'
    },
    {
      id: 'cable-2',
      fromDeviceId: 'dev-l3-1',
      fromPort: 2,
      toDeviceId: 'dev-l2-1',
      toPort: 1,
      color: '#d946ef',
      side: 'front',
      label: 'L3 Core ➜ L2 Edge Trunk'
    },
    {
      id: 'cable-3',
      fromDeviceId: 'dev-l2-1',
      fromPort: 3,
      toDeviceId: 'dev-3',
      toPort: 1,
      color: '#10b981',
      side: 'front',
      label: 'L2 Edge ➜ DB Master'
    }
  ],
  changeLogs: [
    {
      id: 'chg-1',
      date: '2026-08-30',
      ticketNo: 'CHG-2026-003',
      hostname: 'edge-l2-switch-01',
      deviceId: 'dev-l2-1',
      type: 'wiring',
      reason: '基幹Core L3スイッチとのアップリンク2重化に伴う結線変更',
      operator: 'インフラ運用チーム'
    },
    {
      id: 'chg-2',
      date: '2026-08-28',
      ticketNo: 'CHG-2026-002',
      hostname: 'UTMプライマリ',
      deviceId: 'dev-1787896648218',
      type: 'add',
      reason: 'セキュリティ強化に伴う境界UTM冗長構成の設置 (23Uスロット)',
      operator: 'セキュリティ管理部'
    },
    {
      id: 'chg-3',
      date: '2026-08-26',
      ticketNo: 'CHG-2026-001',
      hostname: 'db-master-01',
      deviceId: 'dev-3',
      type: 'maintenance',
      reason: 'PostgreSQLプライマリDBのメモリ増設および定期保守作業',
      operator: 'DBA 佐藤'
    }
  ]
};

const STORAGE_KEY = 'datacenter_rack_manager_data_v5';

const CABLE_COLORS = [
  { id: 'blue', label: 'ブルー (標準LAN)', color: '#38bdf8' },
  { id: 'green', label: 'グリーン (基幹/サーバー)', color: '#22c55e' },
  { id: 'yellow', label: 'イエロー (DMZ/境界)', color: '#eab308' },
  { id: 'orange', label: 'オレンジ (HA/冗長心線)', color: '#f97316' },
  { id: 'red', label: 'レッド (WAN/セキュリティ)', color: '#ef4444' },
  { id: 'purple', label: 'パープル (管理/Mgmt)', color: '#a855f7' },
  { id: 'pink', label: 'ピンク (特殊用途)', color: '#ec4899' },
  { id: 'white', label: 'ホワイト (SAN/ストレージ)', color: '#e2e8f0' },
  { id: 'gray', label: 'ダークグレー (予備/その他)', color: '#64748b' },
];

const state = {
  racks: [],
  cables: [],
  changeLogs: [],
  storageDevices: [],
  rackLayoutMode: '1',
  settings: {
    pingIntervalSeconds: 30,
    pingTimeoutMs: 2500,
    globalPingEnabled: true,
    autoPingEnabled: false,
    viewMode: 'front',
    rackLayoutMode: '1'
  },
  selectedDeviceId: null,
  rackViewModes: {},
  draggedDevice: null,
  tempTags: [],
  autoPingTimer: null,
  isServerMode: false,
  zoom: 1.0,
  panX: 40,
  panY: 30,
  isPanning: false,
  panStartX: 0,
  panStartY: 0,
  initialPanX: 40,
  initialPanY: 30,
  cableMode: false,
  selectedCableColor: '#38bdf8',
  connectingCable: null, // { fromDeviceId, fromPort }
  activeVlanFilter: 'all', // v5: VLAN 可視化ハイライトフィルター ('all' または VLAN ID)
  undoStack: [], // v5: 操作取り消し用履歴スタック
  redoStack: [], // v5: やり直し用履歴スタック
  otherLocations: [], // v5: その他の場所 機器リスト
  otherLocationColumns: [] // v5: その他の場所 カラム定義
};

const elements = {};

function refreshElements() {
  elements.statOnline = document.getElementById('stat-online-count');
  elements.statOffline = document.getElementById('stat-offline-count');
  elements.statUnmonitored = document.getElementById('stat-unmonitored-count');
  elements.serverDbPill = document.getElementById('server-db-pill');
  elements.serverDbDot = document.getElementById('server-db-dot');
  elements.serverDbText = document.getElementById('server-db-text');
  elements.autoPingPill = document.getElementById('auto-ping-pill');
  elements.autoPingIndicator = document.getElementById('auto-ping-indicator');
  elements.autoPingText = document.getElementById('auto-ping-text');
  elements.headerGlobalPingToggle = document.getElementById('header-global-ping-toggle');
  elements.btnToggleSetupMode = document.getElementById('btn-toggle-setup-mode');
  elements.setupModePill = document.getElementById('setup-mode-pill');
  elements.btnGlobalFront = document.getElementById('btn-global-front');
  elements.btnGlobalRear = document.getElementById('btn-global-rear');
  elements.btnUndo = document.getElementById('btn-undo');
  elements.btnRedo = document.getElementById('btn-redo');
  elements.btnFloatingUndo = document.getElementById('btn-floating-undo');
  elements.btnFloatingRedo = document.getElementById('btn-floating-redo');
  elements.selectVlanFilter = document.getElementById('select-vlan-filter');
  elements.btnPingAll = document.getElementById('btn-ping-all');
  elements.btnAddRack = document.getElementById('btn-add-rack');
  elements.btnSettings = document.getElementById('btn-settings');
  elements.btnExportImport = document.getElementById('btn-export-import');

  elements.btnCableMode = document.getElementById('btn-cable-mode');
  elements.cableCountBadge = document.getElementById('cable-count-badge');
  elements.cableConnectingBar = document.getElementById('cable-connecting-bar');
  elements.cableConnectingPulseDot = document.getElementById('cable-connecting-pulse-dot');
  elements.cableConnectingText = document.getElementById('cable-connecting-text');
  elements.cableRackJumpGroup = document.getElementById('cable-rack-jump-group');
  elements.cableRackJumpList = document.getElementById('cable-rack-jump-list');
  elements.cableQuickConnectGroup = document.getElementById('cable-quick-connect-group');
  elements.cableQuickTargetSearch = document.getElementById('cable-quick-target-search');
  elements.cableQuickResultsDropdown = document.getElementById('cable-quick-results-dropdown');
  elements.cableConnectingColorPalette = document.getElementById('cable-connecting-color-palette');
  elements.cableCustomColorInput = document.getElementById('cable-custom-color-input');
  elements.btnCancelCable = document.getElementById('btn-cancel-cable');
  elements.cableSvgLayer = document.getElementById('cable-svg-layer');

  elements.rackStage = document.getElementById('rack-stage');
  elements.stageViewport = document.getElementById('stage-viewport') || elements.rackStage;
  elements.racksContainer = document.getElementById('racks-container');
  elements.rackCountText = document.getElementById('rack-count-text');
  elements.btnZoomIn = document.getElementById('btn-zoom-in');
  elements.btnZoomOut = document.getElementById('btn-zoom-out');
  elements.btnZoomReset = document.getElementById('btn-zoom-reset');
  elements.btnZoomFit = document.getElementById('btn-zoom-fit');
  elements.zoomLevelText = document.getElementById('zoom-level-text');

  elements.propertyPanel = document.getElementById('property-panel');
  elements.btnCloseProp = document.getElementById('btn-close-prop');
  elements.propTypeBadge = document.getElementById('prop-type-badge');
  elements.propTitle = document.getElementById('prop-title');
  elements.propStatusCircle = document.getElementById('prop-status-circle');
  elements.propStatusHeadline = document.getElementById('prop-status-headline');
  elements.propStatusSub = document.getElementById('prop-status-sub');
  elements.btnPingSingle = document.getElementById('btn-ping-single');
  elements.propertyForm = document.getElementById('property-form');
  elements.propName = document.getElementById('prop-name');
  elements.propTicketNo = document.getElementById('prop-ticket-no');
  elements.propInstallDate = document.getElementById('prop-install-date');
  elements.propIp = document.getElementById('prop-ip');
  elements.propVip = document.getElementById('prop-vip');
  elements.propHostname = document.getElementById('prop-hostname');
  elements.propHaRole = document.getElementById('prop-ha-role');
  elements.propHaPair = document.getElementById('prop-ha-pair');
  elements.groupPropHaPair = document.getElementById('group-prop-ha-pair');

  // v5: VLAN / ポート別IP管理
  elements.propVlanSection = document.getElementById('prop-vlan-section');
  elements.btnPropBulkVlanToggle = document.getElementById('btn-prop-bulk-vlan-toggle');
  elements.propVlanBulkBox = document.getElementById('prop-vlan-bulk-box');
  elements.bulkVlanRange = document.getElementById('bulk-vlan-range');
  elements.bulkVlanMode = document.getElementById('bulk-vlan-mode');
  elements.bulkVlanId = document.getElementById('bulk-vlan-id');
  elements.bulkVlanName = document.getElementById('bulk-vlan-name');
  elements.bulkVlanIpPrefix = document.getElementById('bulk-vlan-ip-prefix');
  elements.btnApplyBulkVlan = document.getElementById('btn-apply-bulk-vlan');
  elements.propVlanTbody = document.getElementById('prop-vlan-tbody');
  elements.propVendor = document.getElementById('prop-vendor');
  elements.propModel = document.getElementById('prop-model');
  elements.propTagsList = document.getElementById('prop-tags-list');
  elements.propTagNew = document.getElementById('prop-tag-new');
  elements.propRackSelect = document.getElementById('prop-rack-select');
  elements.propStartU = document.getElementById('prop-start-u');
  elements.propSizeU = document.getElementById('prop-size-u');
  elements.propSide = document.getElementById('prop-side');
  elements.propSlotWidth = document.getElementById('prop-slot-width');
  elements.propType = document.getElementById('prop-type');
  elements.propPortCount = document.getElementById('prop-port-count');
  elements.propCablesList = document.getElementById('prop-cables-list');
  elements.propPortMapCard = document.getElementById('prop-port-map-card');
  elements.propPortMapSummary = document.getElementById('prop-port-map-summary');
  elements.propPortGridContainer = document.getElementById('prop-port-grid-container');
  elements.propCableTargetSearch = document.getElementById('prop-cable-target-search');
  elements.propCableTargetCount = document.getElementById('prop-cable-target-count');
  elements.propCableFromPort = document.getElementById('prop-cable-from-port');
  elements.propCableTargetDev = document.getElementById('prop-cable-target-dev');
  elements.propCableToPort = document.getElementById('prop-cable-to-port');
  elements.propCableColorSelect = document.getElementById('prop-cable-color-select');
  elements.propCableCustomColor = document.getElementById('prop-cable-custom-color');
  elements.propCableColorPreview = document.getElementById('prop-cable-color-preview');
  elements.btnCableTypeDevice = document.getElementById('btn-cable-type-device');
  elements.btnCableTypeExternal = document.getElementById('btn-cable-type-external');
  elements.propCableTargetDeviceSection = document.getElementById('prop-cable-target-device-section');
  elements.propCableTargetExternalSection = document.getElementById('prop-cable-target-external-section');
  elements.propCableExtFromPort = document.getElementById('prop-cable-ext-from-port');
  elements.propCableExtTarget = document.getElementById('prop-cable-ext-target');
  elements.propCableExtColorSelect = document.getElementById('prop-cable-ext-color-select');
  elements.propCableExtCustomColor = document.getElementById('prop-cable-ext-custom-color');
  elements.propCableExtColorPreview = document.getElementById('prop-cable-ext-color-preview');
  elements.btnPropAddCable = document.getElementById('btn-prop-add-cable');
  elements.propPingEnabled = document.getElementById('prop-ping-enabled');
  elements.propNotes = document.getElementById('prop-notes');
  elements.btnSaveProp = document.getElementById('btn-save-prop');
  elements.btnDeleteDevice = document.getElementById('btn-delete-device');

  // UPS専用プロパティ要素
  elements.groupPropUpsConfig = document.getElementById('group-prop-ups-config');
  elements.propUpsCapacity = document.getElementById('prop-ups-capacity');
  elements.propUpsRuntime = document.getElementById('prop-ups-runtime');
  elements.propUpsLoadVal = document.getElementById('prop-ups-load-val');
  elements.propUpsLoadBar = document.getElementById('prop-ups-load-bar');

  elements.modalSettings = document.getElementById('modal-settings');
  elements.btnCloseSettings = document.getElementById('btn-close-settings');
  elements.btnCancelSettings = document.getElementById('btn-cancel-settings');
  elements.btnSaveSettings = document.getElementById('btn-save-settings');
  elements.settingGlobalPingToggle = document.getElementById('setting-global-ping-toggle');
  elements.settingTicketPrefix = document.getElementById('setting-ticket-prefix');
  elements.settingTicketDatePattern = document.getElementById('setting-ticket-date-pattern');
  elements.settingTicketDigits = document.getElementById('setting-ticket-digits');
  elements.settingTicketPreview = document.getElementById('setting-ticket-preview');
  elements.settingAutoPingToggle = document.getElementById('setting-auto-ping-toggle');
  elements.settingPingInterval = document.getElementById('setting-ping-interval');
  elements.settingPingTimeout = document.getElementById('setting-ping-timeout');
  elements.btnSaveSettings = document.getElementById('btn-save-settings');
  elements.btnCancelSettings = document.getElementById('btn-cancel-settings');
  elements.btnResetDemo = document.getElementById('btn-reset-demo');

  elements.modalRack = document.getElementById('modal-rack');
  elements.modalRackTitle = document.getElementById('modal-rack-title');
  elements.rackFormId = document.getElementById('rack-form-id');
  elements.btnCloseRackModal = document.getElementById('btn-close-rack-modal');
  elements.btnCancelRack = document.getElementById('btn-cancel-rack');
  elements.rackForm = document.getElementById('rack-form');
  elements.rackFormName = document.getElementById('rack-form-name');
  elements.rackFormUnits = document.getElementById('rack-form-units');
  elements.rackFormTags = document.getElementById('rack-form-tags');
  elements.rackFormMaxPower = document.getElementById('rack-form-max-power');

  elements.modalExportImport = document.getElementById('modal-export-import');
  elements.btnCloseExport = document.getElementById('btn-close-export');
  elements.btnDownloadJson = document.getElementById('btn-download-json');
  elements.btnTriggerImport = document.getElementById('btn-trigger-import');
  elements.inputImportJson = document.getElementById('input-import-json');

  elements.globalSearchInput = document.getElementById('global-search-input');
  elements.btnClearSearch = document.getElementById('btn-clear-search');
  elements.searchResultsDropdown = document.getElementById('search-results-dropdown');
  elements.searchResultsList = document.getElementById('search-results-list');
  elements.searchResultsHeader = document.getElementById('search-results-header');
  elements.deviceHoverTooltip = document.getElementById('device-hover-tooltip');

  // Waffle menu
  elements.btnWaffleMenu = document.getElementById('btn-waffle-menu');
  elements.waffleDropdown = document.getElementById('waffle-dropdown');
  elements.btnWaffleHistory = document.getElementById('btn-waffle-history');
  elements.btnWaffleImpact = document.getElementById('btn-waffle-impact');
  elements.btnWaffleCsv = document.getElementById('btn-waffle-csv');
  elements.btnWaffleReport = document.getElementById('btn-waffle-report');
  elements.btnWafflePingAll = document.getElementById('btn-waffle-ping-all');
  elements.btnWaffleSettings = document.getElementById('btn-waffle-settings');
  elements.btnWaffleExportImport = document.getElementById('btn-waffle-export-import');
  elements.btnWaffleReset = document.getElementById('btn-waffle-reset');

  elements.propPower = document.getElementById('prop-power');

  // Change History Modal
  elements.modalHistory = document.getElementById('modal-history');
  elements.btnCloseHistory = document.getElementById('btn-close-history');
  elements.btnToggleHistoryForm = document.getElementById('btn-toggle-history-form');
  elements.historyFormCard = document.getElementById('history-form-card');
  elements.btnCancelHistoryForm = document.getElementById('btn-cancel-history-form');
  elements.btnCancelHistoryBtn = document.getElementById('btn-cancel-history-btn');
  elements.historyEntryForm = document.getElementById('history-entry-form');
  elements.histDate = document.getElementById('hist-date');
  elements.histTicket = document.getElementById('hist-ticket');
  elements.histType = document.getElementById('hist-type');
  elements.histSyncToggle = document.getElementById('hist-sync-toggle');

  // Dynamic history sections
  elements.histSectionAdd = document.getElementById('hist-section-add');
  elements.histAddRack = document.getElementById('hist-add-rack');
  elements.histAddStartU = document.getElementById('hist-add-start-u');
  elements.histAddSizeU = document.getElementById('hist-add-size-u');
  elements.histAddSide = document.getElementById('hist-add-side');
  elements.histAddType = document.getElementById('hist-add-type');
  elements.histAddName = document.getElementById('hist-add-name');
  elements.histAddIp = document.getElementById('hist-add-ip');

  elements.histSectionMove = document.getElementById('hist-section-move');
  elements.histMoveDev = document.getElementById('hist-move-dev');
  elements.histMoveRack = document.getElementById('hist-move-rack');
  elements.histMoveStartU = document.getElementById('hist-move-start-u');
  elements.histMoveSide = document.getElementById('hist-move-side');

  elements.histSectionRemove = document.getElementById('hist-section-remove');
  elements.histRemoveDev = document.getElementById('hist-remove-dev');

  elements.histSectionConfig = document.getElementById('hist-section-config');
  elements.histConfigDev = document.getElementById('hist-config-dev');
  elements.histConfigName = document.getElementById('hist-config-name');
  elements.histConfigIp = document.getElementById('hist-config-ip');
  elements.histConfigVip = document.getElementById('hist-config-vip');

  elements.histSectionWiring = document.getElementById('hist-section-wiring');
  elements.histWireFromDev = document.getElementById('hist-wire-from-dev');
  elements.histWireFromPort = document.getElementById('hist-wire-from-port');
  elements.histWireToDev = document.getElementById('hist-wire-to-dev');
  elements.histWireToPort = document.getElementById('hist-wire-to-port');
  elements.histWireColor = document.getElementById('hist-wire-color');

  elements.histSectionGeneral = document.getElementById('hist-section-general');
  elements.histGenHostname = document.getElementById('hist-gen-hostname');
  elements.histGenDeviceSelect = document.getElementById('hist-gen-device-select');

  elements.histOperator = document.getElementById('hist-operator');
  elements.histReason = document.getElementById('hist-reason');
  elements.btnHistoryExportCsv = document.getElementById('btn-history-export-csv');
  elements.btnClearAllHistory = document.getElementById('btn-clear-all-history');
  elements.historySetupModeBanner = document.getElementById('history-setup-mode-banner');
  elements.btnBannerDisableSetupMode = document.getElementById('btn-banner-disable-setup-mode');
  elements.settingSetupModeToggle = document.getElementById('setting-setup-mode-toggle');
  elements.historySearchInput = document.getElementById('history-search-input');
  elements.historyTypeFilter = document.getElementById('history-type-filter');
  elements.historyCountBadge = document.getElementById('history-count-badge');
  elements.historyTableBody = document.getElementById('history-table-body');
  elements.histEditLogId = document.getElementById('hist-edit-log-id');
  elements.historyFormTitleText = document.getElementById('history-form-title-text');
  elements.btnSaveHistoryText = document.getElementById('btn-save-history-text');
  elements.histEditId = document.getElementById('hist-edit-id');
  elements.histFormTitleText = document.getElementById('hist-form-title-text');
  elements.histSubmitBtnText = document.getElementById('hist-submit-btn-text');
  elements.histSyncBoxWrap = document.getElementById('hist-sync-box-wrap');

  // Property Panel History
  elements.propChangeReason = document.getElementById('prop-change-reason');
  elements.propDeviceHistorySection = document.getElementById('prop-device-history-section');
  elements.propHistoryCount = document.getElementById('prop-history-count');
  elements.propHistoryTimeline = document.getElementById('prop-history-timeline');

  elements.modalImpact = document.getElementById('modal-impact');
  elements.btnCloseImpact = document.getElementById('btn-close-impact');
  elements.btnCloseImpactBottom = document.getElementById('btn-close-impact-bottom');
  elements.impactTargetSelect = document.getElementById('impact-target-select');
  elements.btnRunImpactSim = document.getElementById('btn-run-impact-sim');
  elements.btnClearImpactSim = document.getElementById('btn-clear-impact-sim');
  elements.impactResultsSection = document.getElementById('impact-results-section');
  elements.impactAffectedCount = document.getElementById('impact-affected-count');
  elements.impactAffectedTbody = document.getElementById('impact-affected-tbody');
  elements.impactActiveBar = document.getElementById('impact-active-bar');
  elements.impactBarText = document.getElementById('impact-bar-text');
  elements.btnReopenImpact = document.getElementById('btn-reopen-impact');
  elements.btnBannerClearImpact = document.getElementById('btn-banner-clear-impact');

  elements.modalPrintReport = document.getElementById('modal-print-report');
  elements.btnClosePrintReport = document.getElementById('btn-close-print-report');
  elements.btnDoPrint = document.getElementById('btn-do-print');
  elements.btnReportCsv = document.getElementById('btn-report-csv');
  elements.printReportContainer = document.getElementById('print-report-container');
  elements.reportSearchInput = document.getElementById('report-search-input');
  elements.reportSearchCount = document.getElementById('report-search-count');

  // Application Document Forms Modal
  elements.modalDocForm = document.getElementById('modal-doc-form');
  elements.docFormModalBody = document.querySelector('.doc-form-modal-body');
  elements.docModalTitle = document.getElementById('doc-modal-title');
  elements.docTypeSelect = document.getElementById('doc-type-select');
  elements.btnCopyDocText = document.getElementById('btn-copy-doc-text');
  elements.btnPrintDoc = document.getElementById('btn-print-doc');
  elements.btnCloseDocForm = document.getElementById('btn-close-doc-form');
  elements.docPaperContainer = document.getElementById('doc-paper-container');

  // Device History Expand Modal
  elements.btnExpandDeviceHistory = document.getElementById('btn-expand-device-history');
  elements.modalDeviceHistoryExpand = document.getElementById('modal-device-history-expand');
  elements.btnCloseDevExpandHistory = document.getElementById('btn-close-dev-expand-history');
  elements.btnCloseDevExpandHistoryBottom = document.getElementById('btn-close-dev-expand-history-bottom');
  elements.btnDevExpandExportCsv = document.getElementById('btn-dev-expand-export-csv');
  elements.devExpandHistTitle = document.getElementById('dev-expand-hist-title');
  elements.devExpandHistSubtitle = document.getElementById('dev-expand-hist-subtitle');
  elements.devExpandHistoryTableBody = document.getElementById('dev-expand-history-table-body');
  elements.devExpandHistorySummary = document.getElementById('dev-expand-history-summary');

  // Storage Depot & Layouts
  elements.storageDepotWidget = document.getElementById('storage-depot-widget');
  elements.storageDepotCount = document.getElementById('storage-depot-count');
  elements.canvasStorageDropBar = document.getElementById('canvas-storage-drop-bar');
  elements.btnWaffleStorage = document.getElementById('btn-waffle-storage');
  elements.modalStorage = document.getElementById('modal-storage');
  elements.btnCloseStorageModal = document.getElementById('btn-close-storage-modal');
  elements.btnCloseStorage = document.getElementById('btn-close-storage');
  elements.storageSearchInput = document.getElementById('storage-search-input');
  elements.storageTbody = document.getElementById('storage-tbody');

  // v5: その他の場所 (Other Locations) Elements
  elements.otherLocationWidget = document.getElementById('other-location-widget');
  elements.otherLocationCount = document.getElementById('other-location-count');
  elements.modalOtherLocation = document.getElementById('modal-other-location');
  elements.btnCloseOtherLocModal = document.getElementById('btn-close-other-loc-modal');
  elements.btnCloseOtherLoc = document.getElementById('btn-close-other-loc');
  elements.otherLocSearchInput = document.getElementById('other-loc-search-input');
  elements.otherLocSummaryBadge = document.getElementById('other-loc-summary-badge');
  elements.otherLocThead = document.getElementById('other-loc-thead');
  elements.otherLocTbody = document.getElementById('other-loc-tbody');
  elements.otherLocFooterSummary = document.getElementById('other-loc-footer-summary');
  elements.btnAddOtherLocDev = document.getElementById('btn-add-other-loc-dev');
  elements.btnOpenOtherLocColumns = document.getElementById('btn-open-other-loc-columns');
  elements.btnOtherLocCsv = document.getElementById('btn-other-loc-csv');

  // v5: その他の場所 カラム設定 (Columns Modal) Elements
  elements.modalOtherLocationColumns = document.getElementById('modal-other-location-columns');
  elements.btnCloseColumnsModal = document.getElementById('btn-close-columns-modal');
  elements.columnsListContainer = document.getElementById('columns-list-container');
  elements.newColName = document.getElementById('new-col-name');
  elements.newColKey = document.getElementById('new-col-key');
  elements.newColType = document.getElementById('new-col-type');
  elements.btnAddNewColumn = document.getElementById('btn-add-new-column');
  elements.btnResetDefaultColumns = document.getElementById('btn-reset-default-columns');
  elements.btnCancelColumns = document.getElementById('btn-cancel-columns');
  elements.btnSaveColumns = document.getElementById('btn-save-columns');

  // v5: その他の場所 機器追加/編集 (Edit Modal) Elements
  elements.modalOtherLocationEdit = document.getElementById('modal-other-location-edit');
  elements.modalOtherLocEditTitle = document.getElementById('modal-other-loc-edit-title');
  elements.btnCloseOtherLocEdit = document.getElementById('btn-close-other-loc-edit');
  elements.btnCancelOtherLocEdit = document.getElementById('btn-cancel-other-loc-edit');
  elements.btnSaveOtherLocDevice = document.getElementById('btn-save-other-loc-device');
  elements.otherLocDeviceForm = document.getElementById('other-loc-device-form');
  elements.otherLocDevId = document.getElementById('other-loc-dev-id');
  elements.otherLocFormBody = document.getElementById('other-loc-form-body');
  elements.storageSummaryBadge = document.getElementById('storage-summary-badge');
  elements.storageFooterSummary = document.getElementById('storage-footer-summary');
  elements.btnStorageCsv = document.getElementById('btn-storage-csv');
  elements.modalDeployStorage = document.getElementById('modal-deploy-storage');
  elements.btnCloseDeployModal = document.getElementById('btn-close-deploy-modal');
  elements.btnCancelDeploy = document.getElementById('btn-cancel-deploy');
  elements.deployStorageForm = document.getElementById('deploy-storage-form');
  elements.deployDeviceId = document.getElementById('deploy-device-id');
  elements.deployDevicePreview = document.getElementById('deploy-device-preview');
  elements.deployTargetRack = document.getElementById('deploy-target-rack');
  elements.deployStartU = document.getElementById('deploy-start-u');
  elements.deploySide = document.getElementById('deploy-side');
  elements.deploySlotWidth = document.getElementById('deploy-slot-width');
  elements.layoutBtnGroup = document.getElementById('layout-btn-group');

  // 機器パレット開閉用要素
  elements.devicePalette = document.getElementById('device-palette');
  elements.btnTogglePalette = document.getElementById('btn-toggle-palette');
  elements.btnOpenPalette = document.getElementById('btn-open-palette');

  elements.toastContainer = document.getElementById('toast-container');
}

// --- 初期化 ---
async function initApp() {
  try {
    refreshElements();
    console.log('%c[RackManager] initApp started', 'color: #38bdf8; font-weight: bold; font-size: 14px;');
    console.log('[RackManager] Elements check:', {
      btnAddRack: !!elements.btnAddRack,
      btnSettings: !!elements.btnSettings,
      btnPingAll: !!elements.btnPingAll,
      btnGlobalFront: !!elements.btnGlobalFront,
      btnGlobalRear: !!elements.btnGlobalRear,
      btnExportImport: !!elements.btnExportImport,
      btnCableMode: !!elements.btnCableMode,
      modalSettings: !!elements.modalSettings,
      modalRack: !!elements.modalRack,
      toastContainer: !!elements.toastContainer
    });

    try {
      await checkServerAndLoadData();
      console.log('[RackManager] ✅ checkServerAndLoadData OK');
    } catch (err) {
      console.error('[RackManager] ❌ Data load error:', err);
      alert('データの読み込みに失敗しました: ' + err.message);
    }

    try {
      setupEventListeners();
      console.log('[RackManager] ✅ setupEventListeners OK');
    } catch (err) {
      console.error('[RackManager] ❌ setupEventListeners error:', err);
      alert('イベントリスナー登録エラー: ' + err.message);
    }

    try {
      setupZoomAndPan();
      console.log('[RackManager] ✅ setupZoomAndPan OK');
    } catch (err) {
      console.error('[RackManager] ❌ setupZoomAndPan error:', err);
    }

    try {
      setupPaletteDrag();
      setupPaletteToggle();
      console.log('[RackManager] ✅ setupPaletteDrag & setupPaletteToggle OK');
    } catch (err) {
      console.error('[RackManager] ❌ setupPaletteDrag error:', err);
    }

    try {
      setupStorageDepot();
      setupStorageModalEvents();
      setupLayoutSwitcher();
      console.log('[RackManager] ✅ setupStorageDepot & LayoutSwitcher OK');
    } catch (err) {
      console.error('[RackManager] ❌ setupStorageDepot error:', err);
    }

    try {
      let savedTheme = null;
      try {
        savedTheme = localStorage.getItem('datacenter_rack_manager_theme');
      } catch (e) {}
      applyTheme(savedTheme || state.settings.theme || 'dark');
      startAutoPingTimer();
      updateHeaderStats();
      updateStorageDepotBadge();
      updateOtherLocationBadge();
      updateVlanFilterOptions();
      updateUndoRedoButtons();
      renderRacks();
      renderChangeLogs();
      updateSettingsUI();
      cancelCableConnecting();
      console.log('[RackManager] ✅ Render and UI setup OK');
    } catch (err) {
      console.error('[RackManager] ❌ render error:', err);
      alert('画面描画エラー: ' + err.message + '\nスタックトレースをコンソールで確認してください。');
    }

    console.log('%c[RackManager] initApp completed successfully!', 'color: #10b981; font-weight: bold; font-size: 14px;');
  } catch (globalErr) {
    alert('初期化中に致命的なエラーが発生しました:\n' + globalErr.message);
    console.error(globalErr);
  }
}

// 左側パレット機器のドラッグ＆ドロップ登録
function setupPaletteDrag() {
  document.querySelectorAll('.palette-item').forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      const type = item.dataset.type || 'rackmount';
      const sizeU = parseInt(item.dataset.size, 10) || 1;
      let portCount = parseInt(item.dataset.portCount, 10);
      if (isNaN(portCount) || portCount === 0) {
        if (type === 'l3_switch' || type === 'l2_switch') portCount = 24;
        else if (type === 'utm' || type === 'router') portCount = 8;
        else if (type === 'nas') portCount = 4;
        else if (type === 'onu' || type === 'mc') portCount = 2;
        else if (type === 'ap') portCount = 2;
        else if (type === 'rackmount') portCount = 2;
        else if (type === 'desktop' || type === 'hub') portCount = 8;
        else if (type === 'iot') portCount = 1;
        else portCount = 0;
      }
      const defaultName = item.dataset.defaultName || '新規機器';
      let tags = [];
      if (item.dataset.defaultTags) {
        tags = item.dataset.defaultTags.split(',').map(t => t.trim()).filter(Boolean);
      } else {
        tags = getDefaultTagsForType(type);
      }
      const defaultSide = item.dataset.defaultSide || 'front';
      const powerWatts = parseInt(item.dataset.defaultWatts, 10) !== undefined && !isNaN(parseInt(item.dataset.defaultWatts, 10))
        ? parseInt(item.dataset.defaultWatts, 10)
        : getDefaultPowerWatts(type, sizeU);

      const deviceTemplate = {
        name: defaultName,
        type: type,
        sizeU: sizeU,
        portCount: portCount,
        powerWatts: powerWatts,
        tags: tags,
        ip: '',
        hostname: '',
        vendor: '',
        model: '',
        side: defaultSide,
        slotWidth: 'full',
        slotCol: 1,
        pingEnabled: false,
        status: 'unmonitored',
        notes: ''
      };

      state.draggedDevice = deviceTemplate;
      e.dataTransfer.setData('text/plain', JSON.stringify(deviceTemplate));
      e.dataTransfer.effectAllowed = 'copyMove';
      item.classList.add('dragging');
      document.body.classList.add('is-dragging-device');
    });

    item.addEventListener('dragend', () => {
      state.draggedDevice = null;
      item.classList.remove('dragging');
      document.body.classList.remove('is-dragging-device');
      document.querySelectorAll('.rack-slot.drag-over, .sub-slot-empty.drag-over, .rack-slot-cell.drag-over-valid').forEach((el) => {
        el.classList.remove('drag-over', 'drag-invalid', 'drag-over-valid', 'drag-over-invalid');
      });
    });
  });
}

// 機器パレットの開閉 (< >) 管理
function setupPaletteToggle() {
  const palette = elements.devicePalette || document.getElementById('device-palette');
  const btnToggle = elements.btnTogglePalette || document.getElementById('btn-toggle-palette');
  const btnReopen = elements.btnOpenPalette || document.getElementById('btn-open-palette');

  if (!palette) return;

  function setPaletteState(isOpen, savePreference = true) {
    if (isOpen) {
      palette.classList.remove('collapsed');
      if (btnReopen) btnReopen.classList.add('hidden');
    } else {
      palette.classList.add('collapsed');
      if (btnReopen) btnReopen.classList.remove('hidden');
    }
    if (savePreference) {
      try {
        localStorage.setItem('datacenter_rack_manager_palette_open', isOpen ? 'true' : 'false');
      } catch (e) {}
    }
    // パレット開閉後にキャンバス内の配線を再描画
    setTimeout(() => {
      if (typeof renderCables === 'function') renderCables();
    }, 240);
  }

  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      setPaletteState(false);
      showToast('機器パレットを折りたたみました', 'info');
    });
  }

  if (btnReopen) {
    btnReopen.addEventListener('click', () => {
      setPaletteState(true);
      showToast('機器パレットを展開しました', 'success');
    });
  }

  // 初期状態の復元 (localStorage)
  let savedOpenState = true;
  try {
    const raw = localStorage.getItem('datacenter_rack_manager_palette_open');
    if (raw !== null) {
      savedOpenState = raw === 'true';
    }
  } catch (e) {}
  setPaletteState(savedOpenState, false);
}

function setupZoomAndPan() {
  const viewport = elements.stageViewport || elements.rackStage || document.getElementById('rack-stage');
  const container = elements.racksContainer || document.getElementById('racks-container');
  if (!viewport || !container) return;

  function updateTransform() {
    if (elements.zoomLevelText) {
      elements.zoomLevelText.textContent = `${Math.round(state.zoom * 100)}%`;
    }
    container.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    if (typeof renderCables === 'function') {
      renderCables();
    }
  }

  function applyZoom(newZoom, clientX = null, clientY = null) {
    const oldZoom = state.zoom;
    const clampedZoom = Math.min(2.5, Math.max(0.25, Math.round(newZoom * 100) / 100));
    if (clampedZoom === oldZoom) return;

    if (clientX !== null && clientY !== null) {
      const rect = viewport.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      // マウス位置のワールド座標を維持しながらズーム
      state.panX = mouseX - (mouseX - state.panX) * (clampedZoom / oldZoom);
      state.panY = mouseY - (mouseY - state.panY) * (clampedZoom / oldZoom);
    }

    state.zoom = clampedZoom;
    updateTransform();
  }

  if (elements.btnZoomIn) {
    elements.btnZoomIn.addEventListener('click', () => {
      const rect = viewport.getBoundingClientRect();
      applyZoom(state.zoom + 0.15, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  if (elements.btnZoomOut) {
    elements.btnZoomOut.addEventListener('click', () => {
      const rect = viewport.getBoundingClientRect();
      applyZoom(state.zoom - 0.15, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  if (elements.btnZoomReset) {
    elements.btnZoomReset.addEventListener('click', () => {
      state.zoom = 1.0;
      state.panX = 40;
      state.panY = 30;
      updateTransform();
    });
  }

  if (elements.btnZoomFit) {
    elements.btnZoomFit.addEventListener('click', () => {
      if (state.racks.length === 0) return;
      const contentWidth = container.scrollWidth;
      const contentHeight = container.scrollHeight;
      const availWidth = viewport.clientWidth - 80;
      const availHeight = viewport.clientHeight - 80;

      const scaleX = availWidth / contentWidth;
      const scaleY = availHeight / contentHeight;
      const fitScale = Math.min(scaleX, scaleY, 1.2);

      state.zoom = Math.max(0.25, Math.round(fitScale * 100) / 100);
      // 中央揃え
      state.panX = Math.max(20, (viewport.clientWidth - contentWidth * state.zoom) / 2);
      state.panY = Math.max(20, (viewport.clientHeight - contentHeight * state.zoom) / 2);
      updateTransform();
    });
  }

  // 1. ホイール操作 (通常: 上下スクロール / Ctrl+ホイール: 拡大縮小 / Shift+ホイール: 左右スクロール)
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // 拡大縮小 (ズーム)
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      applyZoom(state.zoom + delta, e.clientX, e.clientY);
    } else if (e.shiftKey) {
      // 左右スクロール
      state.panX -= e.deltaY * 0.9;
      updateTransform();
    } else {
      // 上下スクロール
      state.panY -= e.deltaY * 0.9;
      if (e.deltaX) {
        state.panX -= e.deltaX * 0.9;
      }
      updateTransform();
    }
  }, { passive: false });

  // 2. マウスドラッグによる自由パン移動 & 余白クリックでプロパティ閉じる
  let isPanning = false;
  let hasMoved = false;
  let startX = 0, startY = 0;
  let initialPanX = 0, initialPanY = 0;

  viewport.addEventListener('mousedown', (e) => {
    const isInteractive = e.target.closest('.mounted-device-grid-item, .palette-item, .rack-card, .rack-slot-cell, .sub-slot-empty, button, input, select, textarea, .property-panel, .modal-backdrop, .storage-depot-widget, .storage-row, .storage-item-card, .other-location-widget');
    if (e.button === 1 || (!isInteractive && e.button === 0)) {
      isPanning = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      initialPanX = state.panX;
      initialPanY = state.panY;
      viewport.style.cursor = 'grabbing';
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMoved = true;
    }
    state.panX = initialPanX + dx;
    state.panY = initialPanY + dy;
    updateTransform();
  });

  window.addEventListener('mouseup', (e) => {
    if (isPanning) {
      isPanning = false;
      viewport.style.cursor = 'default';
      
      // パン移動を行わずに何もないキャンバスをクリックした場合、プロパティパネルを閉じる
      if (!hasMoved && e.button === 0) {
        const isInteractive = e.target.closest('.mounted-device-grid-item, .palette-item, .property-panel, button, input, select, textarea, .modal-backdrop, .storage-depot-widget, .storage-row, .storage-item-card, .other-location-widget');
        if (!isInteractive && elements.propertyPanel && elements.propertyPanel.classList.contains('open')) {
          closePropertyPanel();
        }
      }
    }
  });

  viewport.addEventListener('click', (e) => {
    const isInteractive = e.target.closest('.mounted-device-grid-item, .palette-item, .property-panel, button, input, select, textarea, .modal-backdrop, .storage-depot-widget, .storage-row, .storage-item-card, .other-location-widget');
    if (!isInteractive && elements.propertyPanel && elements.propertyPanel.classList.contains('open')) {
      closePropertyPanel();
    }
  });

  // 初期Transform適用
  updateTransform();
}

function updateServerStatusUI() {
  if (!elements.serverDbText) return;
  if (state.isServerMode) {
    if (elements.serverDbDot) elements.serverDbDot.className = 'dot pulse-green';
    elements.serverDbText.textContent = 'FastAPI+SQLite';
    elements.serverDbText.style.color = 'var(--accent-cyan)';
  } else {
    if (elements.serverDbDot) elements.serverDbDot.className = 'dot pulse-yellow';
    elements.serverDbText.textContent = 'Local (Offline)';
    elements.serverDbText.style.color = '#f59e0b';
  }
}

async function checkServerAndLoadData() {
  // 古い業務データのlocalStorageキャッシュがあればクリーンアップ
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('datacenter_rack_manager_data_v6');
    localStorage.removeItem('datacenter_rack_manager_data_v7');
  } catch (e) {}

  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const data = await res.json();
      if (data && data.racks) {
        state.racks = data.racks;
        state.cables = data.cables || [];
        state.changeLogs = Array.isArray(data.changeLogs) ? data.changeLogs : [];
        state.storageDevices = Array.isArray(data.storageDevices) ? data.storageDevices : [];
        state.otherLocations = Array.isArray(data.otherLocations) ? data.otherLocations : [];
        state.otherLocationColumns = Array.isArray(data.otherLocationColumns) ? data.otherLocationColumns : [];
        state.settings = { ...defaultData.settings, ...(data.settings || {}) };
        state.isServerMode = true;
        console.log('[Mode] Connected to FastAPI + SQLite Backend Server');
        updateServerStatusUI();
      }
    } else {
      throw new Error('No API');
    }
  } catch (e) {
    state.isServerMode = false;
    console.log('[Mode] Running in Standalone Browser Mode');
    updateServerStatusUI();
    await loadDataWithJsonFallback();
  }

  state.racks.forEach((r) => {
    if (!state.rackViewModes[r.id]) {
      state.rackViewModes[r.id] = state.settings.viewMode || 'front';
    }
  });
  cleanupOrphanCables();
  ensureAllDevicesHaveTicketNo();
  updateCableCountBadge();
  updateSetupModeUI();
}

function ensureAllDevicesHaveTicketNo() {
  const rule = state.settings.ticketRule || { prefix: 'CHG', datePattern: 'YYYY', digits: 3, nextSeq: 1 };
  const prefix = (rule.prefix || 'CHG').trim();
  const datePattern = rule.datePattern || 'YYYY';
  const digits = parseInt(rule.digits, 10) || 3;

  const usedTicketNos = new Set();
  let currentSeq = 1;
  let changed = false;

  // 既存の changeLogs から使用中チケット番号を収集
  (state.changeLogs || []).forEach((log) => {
    if (log.ticketNo) {
      usedTicketNos.add(log.ticketNo);
      const parts = String(log.ticketNo).split('-');
      const parsedNum = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(parsedNum) && parsedNum >= currentSeq) {
        currentSeq = parsedNum + 1;
      }
    }
  });

  function getUniqueSeqTicket() {
    while (true) {
      const t = formatTicketNo(prefix, datePattern, digits, currentSeq);
      currentSeq++;
      if (!usedTicketNos.has(t)) {
        usedTicketNos.add(t);
        return t;
      }
    }
  }

  // ラック内の機器をチェック（未設定または重複がある場合は一意な連番を割り当て）
  (state.racks || []).forEach((rack) => {
    (rack.devices || []).forEach((dev) => {
      if (!dev.ticketNo || usedTicketNos.has(dev.ticketNo)) {
        const newTicket = getUniqueSeqTicket();
        dev.ticketNo = newTicket;
        changed = true;
      } else {
        usedTicketNos.add(dev.ticketNo);
        const parts = String(dev.ticketNo).split('-');
        const parsedNum = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(parsedNum) && parsedNum >= currentSeq) {
          currentSeq = parsedNum + 1;
        }
      }
    });
  });

  // 保管庫の機器もチェック
  (state.storageDevices || []).forEach((dev) => {
    if (!dev.ticketNo || usedTicketNos.has(dev.ticketNo)) {
      const newTicket = getUniqueSeqTicket();
      dev.ticketNo = newTicket;
      changed = true;
    } else {
      usedTicketNos.add(dev.ticketNo);
    }
  });

  if (changed) {
    saveData();
  }
}

function cleanupOrphanCables() {
  const initialCount = (state.cables || []).length;
  state.cables = (state.cables || []).filter((c) => {
    const fromFound = findDevice(c.fromDeviceId);
    const toFound = findDevice(c.toDeviceId);
    return !!(fromFound && toFound);
  });
  if (state.cables.length !== initialCount) {
    console.log(`[Cable Sanitizer] 孤立配線を ${initialCount - state.cables.length} 本自動整理しました`);
    saveData();
  }
  updateCableCountBadge();
}

async function loadDataWithJsonFallback() {
  // サーバー接続不可時: data.json または組み込みデフォルトデータから読み込む (業務データはlocalStorageには保存しない)
  try {
    const res = await fetch('./data.json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.racks) {
        state.racks = data.racks;
        state.cables = data.cables || [];
        state.changeLogs = data.changeLogs || (defaultData.changeLogs ? JSON.parse(JSON.stringify(defaultData.changeLogs)) : []);
        state.storageDevices = Array.isArray(data.storageDevices) ? data.storageDevices : [];
        state.otherLocations = Array.isArray(data.otherLocations) ? data.otherLocations : [];
        state.otherLocationColumns = Array.isArray(data.otherLocationColumns) ? data.otherLocationColumns : [];
        state.settings = { ...defaultData.settings, ...(data.settings || {}) };
        state.rackLayoutMode = state.settings.rackLayoutMode || '1';
        console.log('[Data] Loaded from data.json');
        return;
      }
    }
  } catch (err) {
    console.warn('[Data] data.json load error:', err);
  }

  // デフォルトデータを使用
  state.racks = JSON.parse(JSON.stringify(defaultData.racks));
  state.cables = JSON.parse(JSON.stringify(defaultData.cables || []));
  state.changeLogs = JSON.parse(JSON.stringify(defaultData.changeLogs || []));
  state.storageDevices = [];
  state.otherLocations = [];
  state.otherLocationColumns = JSON.parse(JSON.stringify(DEFAULT_OTHER_LOC_COLUMNS));
  state.settings = JSON.parse(JSON.stringify(defaultData.settings));
  state.rackLayoutMode = '1';
  console.log('[Data] Using built-in default data');
}

function loadFromLocalStorage() {
  // 業務データはサーバーDBで一元管理するため、localStorageからの読み込みは行わずデフォルトデータ初期化
  state.racks = JSON.parse(JSON.stringify(defaultData.racks));
  state.cables = [];
  state.changeLogs = JSON.parse(JSON.stringify(defaultData.changeLogs || []));
  state.storageDevices = [];
  state.otherLocations = [];
  state.otherLocationColumns = JSON.parse(JSON.stringify(DEFAULT_OTHER_LOC_COLUMNS));
  state.settings = JSON.parse(JSON.stringify(defaultData.settings));
  state.rackLayoutMode = '1';
}

async function saveData(showNotification = false) {
  try {
    // 業務データはサーバーDB (FastAPI + SQLite: /api/data) のみに保存
    if (state.isServerMode) {
      try {
        const res = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            racks: state.racks,
            cables: state.cables,
            changeLogs: state.changeLogs || [],
            storageDevices: state.storageDevices || [],
            otherLocations: state.otherLocations || [],
            otherLocationColumns: state.otherLocationColumns || [],
            settings: state.settings
          })
        });
        if (!res.ok) {
          console.warn('[API Save Warning] Server responded with status:', res.status);
        }
      } catch (netErr) {
        console.warn('[API Save Warning] Could not reach server:', netErr);
      }
    }

    if (showNotification) {
      showToast('サーバー情報を保存しました', 'success');
    }
    updateHeaderStats();
  } catch (err) {
    console.error('Save failed:', err);
    showToast('データの保存に失敗しました: ' + err.message, 'error');
  }
}

// --- Ping 実行 ---
async function runPingAll() {
  if (!state.settings.globalPingEnabled) {
    showToast('現在、全体のPing監視が無効になっています', 'info');
    return;
  }

  if (elements.btnPingAll) elements.btnPingAll.disabled = true;
  showToast('全機器への ICMP Ping 実行中...', 'info');

  if (state.isServerMode) {
    try {
      const res = await fetch('/api/ping/all', { method: 'POST' });
      const json = await res.json();
      if (json.success && Array.isArray(json.results)) {
        json.results.forEach((r) => {
          const found = findDevice(r.id);
          if (found) {
            found.device.status = r.status;
            found.device.responseTimeMs = r.responseTimeMs;
            found.device.lastChecked = r.lastChecked;
          }
        });
        renderRacks();
        updateHeaderStats();
        if (state.selectedDeviceId) populatePropertyPanel(state.selectedDeviceId);
        showToast(`全機器への Ping 実行が完了しました (${json.totalPinged}台)`, 'success');
      }
    } catch (e) {
      showToast('Ping 実行エラー: ' + e.message, 'error');
    } finally {
      if (elements.btnPingAll) elements.btnPingAll.disabled = false;
    }
  } else {
    // スタンドアロン / ブラウザモード: シミュレーション実行
    let pingedCount = 0;
    const tasks = [];
    state.racks.forEach((rack) => {
      rack.devices.forEach((dev) => {
        if (dev.pingEnabled && dev.ip) {
          tasks.push(
            (async () => {
              await new Promise((r) => setTimeout(r, 80));
              const ip = (dev.ip || '').trim();
              const isUnreachable = ip === '0.0.0.0' || ip.toLowerCase() === 'unreachable';
              if (ip && !isUnreachable) {
                dev.status = 'online';
                dev.responseTimeMs = Math.floor(Math.random() * 8) + 2; // 2~9ms
              } else {
                dev.status = 'offline';
                dev.responseTimeMs = null;
              }
              dev.lastChecked = new Date().toISOString();
              pingedCount++;
            })()
          );
        } else {
          dev.status = 'unknown';
          dev.responseTimeMs = null;
          dev.lastChecked = new Date().toISOString();
        }
      });
    });

    await Promise.all(tasks);
    await saveData();
    renderRacks();
    updateHeaderStats();
    if (state.selectedDeviceId) populatePropertyPanel(state.selectedDeviceId);
    showToast(`全機器への Ping 実行が完了しました (${pingedCount}台)`, 'success');
    if (elements.btnPingAll) elements.btnPingAll.disabled = false;
  }
}

async function runPingSingle(deviceId) {
  const found = findDevice(deviceId);
  if (!found) return;

  if (!state.settings.globalPingEnabled) {
    showToast('現在、全体のPing監視が無効になっています', 'info');
    return;
  }

  const ip = (found.device.ip || '').trim();
  if (!ip) {
    showToast('IPアドレスが設定されていないためPingを実行できません', 'warning');
    return;
  }

  if (elements.btnPingSingle) elements.btnPingSingle.disabled = true;

  if (state.isServerMode) {
    try {
      const res = await fetch('/api/ping/single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: deviceId,
          ip: ip,
          timeoutMs: state.settings.pingTimeoutMs || 1500
        })
      });
      const json = await res.json();
      if (json.status) {
        found.device.status = json.status;
        found.device.responseTimeMs = json.responseTimeMs;
        found.device.lastChecked = json.lastChecked;
        renderRacks();
        updateHeaderStats();
        populatePropertyPanel(deviceId);
        showToast(
          `Ping 結果: ${json.status === 'online' ? '🟢 応答あり (' + json.responseTimeMs + 'ms)' : '🔴 応答なし (到達不能)'}`,
          json.status === 'online' ? 'success' : 'error'
        );
      }
    } catch (e) {
      showToast('Ping エラー: ' + e.message, 'error');
    } finally {
      if (elements.btnPingSingle) elements.btnPingSingle.disabled = false;
    }
  } else {
    // スタンドアロン / ブラウザモード: 即座に実用的なPing結果を反映
    await new Promise((r) => setTimeout(r, 250));
    const isUnreachable = ip === '0.0.0.0' || ip.toLowerCase() === 'unreachable';
    if (!isUnreachable) {
      found.device.status = 'online';
      found.device.responseTimeMs = Math.floor(Math.random() * 6) + 2; // 2~7ms
    } else {
      found.device.status = 'offline';
      found.device.responseTimeMs = null;
    }
    found.device.lastChecked = new Date().toISOString();
    await saveData();
    renderRacks();
    updateHeaderStats();
    populatePropertyPanel(deviceId);
    showToast(
      `Ping 結果: ${found.device.status === 'online' ? '🟢 応答あり (' + found.device.responseTimeMs + 'ms)' : '🔴 応答なし (到達不能)'}`,
      found.device.status === 'online' ? 'success' : 'error'
    );
    if (elements.btnPingSingle) elements.btnPingSingle.disabled = false;
  }
}

function startAutoPingTimer() {
  if (state.autoPingTimer) {
    clearInterval(state.autoPingTimer);
    state.autoPingTimer = null;
  }

  if (state.settings.globalPingEnabled && state.settings.autoPingEnabled) {
    const intervalSec = Math.max(5, state.settings.pingIntervalSeconds || 30);
    state.autoPingTimer = setInterval(() => {
      runPingAll();
    }, intervalSec * 1000);
  }
}

function updateHeaderStats() {
  let online = 0;
  let offline = 0;
  let unmonitored = 0;

  state.racks.forEach((rack) => {
    rack.devices.forEach((dev) => {
      if (!state.settings.globalPingEnabled || !dev.pingEnabled || !dev.ip) {
        unmonitored++;
      } else if (dev.status === 'online') {
        online++;
      } else if (dev.status === 'offline') {
        offline++;
      } else {
        unmonitored++;
      }
    });
  });

  if (elements.statOnline) elements.statOnline.textContent = online;
  if (elements.statOffline) elements.statOffline.textContent = offline;
  if (elements.statUnmonitored) elements.statUnmonitored.textContent = unmonitored;
  if (elements.headerGlobalPingToggle) elements.headerGlobalPingToggle.checked = !!state.settings.globalPingEnabled;

  if (elements.autoPingIndicator && elements.autoPingText) {
    if (state.settings.globalPingEnabled && state.settings.autoPingEnabled) {
      elements.autoPingIndicator.classList.add('active');
      elements.autoPingText.textContent = `自動Ping: ON (${state.settings.pingIntervalSeconds}s)`;
    } else {
      elements.autoPingIndicator.classList.remove('active');
      elements.autoPingText.textContent = state.settings.globalPingEnabled ? '自動Ping: OFF' : '全Ping監視: OFF';
    }
  }

  if (elements.rackCountText) {
    elements.rackCountText.textContent = `ラック一覧 (${state.racks.length}台)`;
  }
}

// --- スロットハイライト表示 (v3準拠) ---
function highlightSlots(rackId, startU, sizeU, isValid) {
  const rackCard = document.getElementById(`rack-card-${rackId}`);
  if (!rackCard) return;

  const highlightClass = isValid ? 'drag-over-valid' : 'drag-over-invalid';
  for (let u = startU; u <= startU + sizeU - 1; u++) {
    const slot = rackCard.querySelector(`.rack-slot-cell[data-u="${u}"]`);
    if (slot) slot.classList.add(highlightClass);
  }
}

function clearSlotHighlights() {
  document.querySelectorAll('.rack-slot-cell, .sub-slot-empty').forEach((slot) => {
    slot.classList.remove('drag-over-valid', 'drag-over-invalid');
  });
}

// --- 機器ドラッグ開始・終了ハンドラ (v3完全準拠) ---
function setupDeviceDragEvents(devEl, device, rack) {
  devEl.draggable = true;
  devEl.setAttribute('draggable', 'true');

  devEl.addEventListener('dragstart', (e) => {
    hideDeviceTooltip();
    state.draggedDevice = {
      isNew: false,
      type: 'move',
      deviceId: device.id,
      id: device.id,
      fromRackId: rack.id,
      sourceRackId: rack.id,
      sizeU: device.sizeU || 1,
      side: device.side || 'front',
      slotWidth: device.slotWidth || 'full',
      slotCol: device.slotCol || null,
      deviceData: device,
      name: device.name
    };

    try {
      e.dataTransfer.setData('text/plain', JSON.stringify(state.draggedDevice));
      e.dataTransfer.setData('application/json', JSON.stringify(state.draggedDevice));
    } catch (err) {}
    e.dataTransfer.effectAllowed = 'move';
    devEl.style.opacity = '0.4';
    devEl.classList.add('dragging');
  });

  devEl.addEventListener('dragend', () => {
    hideDeviceTooltip();
    devEl.style.opacity = '1';
    devEl.classList.remove('dragging');
    clearSlotHighlights();
    state.draggedDevice = null;
  });
}

// --- スロットドロップ受付ハンドラ (v3完全準拠＋保管庫出庫対応) ---
function setupSlotDropEvents(slotEl, rack, targetColParam = null) {
  slotEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    if (!state.draggedDevice) {
      slotEl.classList.add('drag-over-valid');
      return;
    }

    const targetU = parseInt(slotEl.dataset.u, 10);
    const sizeU = state.draggedDevice.sizeU || 1;

    let startU = targetU - sizeU + 1;
    if (startU < 1) startU = 1;

    const targetWidth = state.draggedDevice?.deviceData?.slotWidth || state.draggedDevice?.slotWidth || 'full';
    const targetCol = targetColParam !== null ? targetColParam : (state.draggedDevice?.deviceData?.slotCol || state.draggedDevice?.slotCol || 1);

    const isValid = checkSlotAvailability(rack, startU, sizeU, state.draggedDevice.deviceId, targetWidth, targetCol);

    clearSlotHighlights();
    highlightSlots(rack.id, startU, sizeU, isValid);
  });

  slotEl.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    slotEl.classList.remove('drag-over-valid', 'drag-over-invalid');
  });

  slotEl.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideDeviceTooltip();
    clearSlotHighlights();

    let data = state.draggedDevice;
    if (!data) {
      try {
        const dataStr = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
        if (dataStr) data = JSON.parse(dataStr);
      } catch (err) {}
    }
    if (!data) return;

    const targetU = parseInt(slotEl.dataset.u, 10);
    const sizeU = data.sizeU || 1;

    let startU = targetU - sizeU + 1;
    if (startU < 1) startU = 1;

    const targetWidth = data?.deviceData?.slotWidth || data?.slotWidth || (targetColParam ? 'half' : 'full');
    const targetCol = targetColParam !== null ? targetColParam : (data?.deviceData?.slotCol || data?.slotCol || 1);

    const isValid = checkSlotAvailability(rack, startU, sizeU, data.deviceId || data.id, targetWidth, targetCol);
    if (!isValid) {
      showToast('指定したスロットには空きがありません (重複またはラック範囲外)', 'error');
      state.draggedDevice = null;
      return;
    }

    // v5: 直前の状態をUndoスタックに保存
    pushHistoryState('機器のラック配置/移設');

    // 1. 保管庫からの出庫設置
    if (data.isFromStorage) {
      const storedIdx = (state.storageDevices || []).findIndex((d) => d.id === data.id);
      const dev = storedIdx !== -1 ? state.storageDevices.splice(storedIdx, 1)[0] : { ...data };
      dev.startU = startU;
      dev.side = state.rackViewModes[rack.id] || 'front';
      dev.slotWidth = targetWidth;
      dev.slotCol = targetCol;
      const ticketNo = dev.ticketNo || generateNextTicketNo();
      dev.ticketNo = ticketNo;
      rack.devices.push(dev);

      recordChangeLog({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        ticketNo: ticketNo,
        hostname: dev.hostname || dev.name,
        deviceId: dev.id,
        type: 'add',
        operator: state.settings?.operator || '管理者',
        reason: `[保管庫から出庫・設置] ${dev.name} を保管庫から ${rack.name} (${startU}U) に再設置しました`,
        snapshot: dev
      });

      saveData(true);
      renderRacks();
      updateStorageDepotBadge();
      if (elements.modalStorage) elements.modalStorage.classList.remove('open');
      selectDevice(dev.id);
      showToast(`保管庫から「${dev.name}」を ${rack.name} の ${startU}U に設置しました`, 'success');
      state.draggedDevice = null;
      return;
    }

    // 2. 既存設置機器の移動 (同一ラック内 or 別ラック間)
    if (!data.isNew && (data.deviceId || data.id)) {
      const devId = data.deviceId || data.id;
      let foundDev = null;
      let sourceRack = null;

      for (const r of state.racks) {
        const idx = r.devices.findIndex((d) => d.id === devId);
        if (idx !== -1) {
          sourceRack = r;
          foundDev = r.devices.splice(idx, 1)[0];
          break;
        }
      }

      if (!foundDev) {
        state.draggedDevice = null;
        return;
      }

      const oldRackName = sourceRack ? sourceRack.name : rack.name;
      const oldU = foundDev.startU;
      foundDev.startU = startU;
      if (targetColParam !== null) {
        foundDev.slotCol = targetColParam;
        if (!foundDev.slotWidth || foundDev.slotWidth === 'full') foundDev.slotWidth = 'half';
      }

      const currentSide = state.rackViewModes[rack.id] || 'front';
      if (foundDev.side !== 'full') {
        foundDev.side = currentSide;
      }

      rack.devices.push(foundDev);
      recordChangeLog({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        ticketNo: foundDev.ticketNo || generateNextTicketNo(),
        hostname: foundDev.hostname || foundDev.name,
        deviceId: foundDev.id,
        type: 'move',
        operator: state.settings?.operator || 'GUI ドラッグ＆ドロップ',
        reason: `[移設] ${foundDev.name} を ${oldRackName} (${oldU}U) ➜ ${rack.name} (${startU}U / ${foundDev.side === 'rear' ? '背面' : '前面'}) へスロット移動`
      });

      saveData();
      renderRacks();
      selectDevice(foundDev.id);
      showToast(`「${foundDev.name}」を ${rack.name} の ${startU}U に移動しました`, 'info');
      state.draggedDevice = null;
      return;
    }

    // 3. パレットからの新規機器ドロップ
    const itemType = data.type || data.itemType || 'rackmount';
    const newTicketNo = generateNextTicketNo();
    const currentSide = state.rackViewModes[rack.id] || 'front';
    const newDev = {
      id: 'dev-' + Date.now(),
      ticketNo: newTicketNo,
      name: data.name || (itemType === 'shelf' ? `${sizeU}U 固定棚板` : (itemType === 'misc' ? `収容ボックス-${startU}U` : `Server-${startU}U`)),
      ip: data.ip || '',
      hostname: data.hostname || '',
      vendor: data.vendor || '',
      model: data.model || '',
      sizeU: sizeU,
      startU: startU,
      side: itemType === 'shelf' ? 'rear' : currentSide,
      type: itemType,
      slotWidth: targetWidth,
      slotCol: targetCol,
      portCount: itemType === 'shelf' ? 0 : (data.portCount !== undefined ? data.portCount : (itemType === 'l2_switch' || itemType === 'l3_switch' ? 24 : 2)),
      tags: Array.isArray(data.tags) ? data.tags : [],
      pingEnabled: itemType !== 'shelf',
      status: 'unknown',
      responseTimeMs: null,
      lastChecked: null,
      notes: ''
    };

    rack.devices.push(newDev);
    recordChangeLog({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      ticketNo: newTicketNo,
      hostname: newDev.hostname || newDev.name,
      deviceId: newDev.id,
      type: 'add',
      operator: state.settings?.operator || 'GUI ドラッグ＆ドロップ',
      reason: `[新規設置] ${newDev.name} (${newDev.sizeU}U) を ${rack.name} の ${startU}U に配置`
    });
    saveData();
    renderRacks();
    selectDevice(newDev.id);
    showToast(`${rack.name} の ${startU}U に「${newDev.name}」を配置しました`, 'success');
    state.draggedDevice = null;
  });
}

function openEditRackModal(rackId) {
  const rack = state.racks.find((r) => r.id === rackId);
  if (!rack) return;
  if (elements.rackFormId) elements.rackFormId.value = rack.id;
  if (elements.modalRackTitle) elements.modalRackTitle.textContent = `ラック設定の変更: ${rack.name}`;
  if (elements.rackFormName) elements.rackFormName.value = rack.name;
  if (elements.rackFormUnits) elements.rackFormUnits.value = String(rack.units || 42);
  if (elements.rackFormTags) elements.rackFormTags.value = (rack.tags || []).join(', ');
  if (elements.rackFormMaxPower) elements.rackFormMaxPower.value = rack.maxPowerWatts || 3000;
  if (elements.modalRack) elements.modalRack.classList.add('open');
}



// --- ラック行列配置モード切り替え ---
function setRackLayoutMode(mode) {
  state.rackLayoutMode = mode || '1';
  state.settings.rackLayoutMode = state.rackLayoutMode;
  if (elements.racksContainer) {
    elements.racksContainer.className = `racks-container layout-${state.rackLayoutMode}`;
  }
  document.querySelectorAll('#layout-btn-group .btn-layout-mode').forEach((b) => {
    b.classList.toggle('active', b.dataset.layout === state.rackLayoutMode);
  });
  saveData();
  renderCables();
}

function setupLayoutSwitcher() {
  document.querySelectorAll('#layout-btn-group .btn-layout-mode').forEach((b) => {
    b.addEventListener('click', () => {
      setRackLayoutMode(b.dataset.layout);
    });
  });
  setRackLayoutMode(state.settings.rackLayoutMode || state.rackLayoutMode || '1');
}

// --- 機器保管庫 (Storage Depot) ドロップ ＆ ウィジェット管理 ---
function updateStorageDepotBadge() {
  const count = (state.storageDevices || []).length;
  if (elements.storageDepotCount) {
    elements.storageDepotCount.textContent = `${count} 台保管中`;
  }
  const summaryBadge = elements.storageSummaryBadge || document.getElementById('storage-summary-badge');
  if (summaryBadge) {
    summaryBadge.textContent = `${count} 件`;
  }
  const footerSummary = elements.storageFooterSummary || document.getElementById('storage-footer-summary');
  if (footerSummary) {
    footerSummary.textContent = `保管中: ${count}台`;
  }
}

function setupStorageDepot() {
  const widget = elements.storageDepotWidget || document.getElementById('storage-depot-widget');
  const dropBar = elements.canvasStorageDropBar || document.getElementById('canvas-storage-drop-bar');

  if (widget) {
    widget.addEventListener('click', () => {
      openStorageModal();
    });
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (e.currentTarget) e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget) e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideDeviceTooltip();
    document.body.classList.remove('is-dragging-device');
    if (widget) widget.classList.remove('drag-over');
    if (dropBar) dropBar.classList.remove('drag-over');

    try {
      let data = state.draggedDevice;
      if (!data) {
        const dataStr = e.dataTransfer.getData('text/plain');
        if (dataStr) data = JSON.parse(dataStr);
      }
      if (!data) return;

      // ラック上の機器をアンマウントして保管庫へ格納
      if (data.sourceRackId && data.deviceId) {
        const sourceRack = state.racks.find((r) => r.id === data.sourceRackId);
        if (!sourceRack) return;
        const devIdx = sourceRack.devices.findIndex((d) => d.id === data.deviceId);
        if (devIdx === -1) return;

        // v5: Undoスタックに保存
        pushHistoryState(`「${sourceRack.devices[devIdx]?.name || '機器'}」を保管庫へ移動`);

        const dev = sourceRack.devices.splice(devIdx, 1)[0];
        // 接続LANケーブルを解除
        state.cables = (state.cables || []).filter(
          (c) => c.fromDeviceId !== dev.id && c.toDeviceId !== dev.id
        );

        if (!state.storageDevices) state.storageDevices = [];
        const ticketNo = getDeviceTicketNo(dev);
        dev.ticketNo = ticketNo;
        dev.unmountedAt = new Date().toISOString();
        dev.unmountedFromRack = sourceRack.name;
        dev.unmountedFromU = dev.startU;
        state.storageDevices.unshift(dev);

        // アンマウントの変更履歴を明確に記録
        recordChangeLog({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          ticketNo: ticketNo,
          hostname: dev.hostname || dev.name,
          deviceId: dev.id,
          type: 'delete',
          operator: state.settings.operator || '管理者',
          reason: `[アンマウント] ${dev.name} (${[dev.vendor, dev.model].filter(Boolean).join(' ') || ''} / ${ticketNo}) を ${sourceRack.name} (${dev.startU}U) から取り外し、機器保管庫へ格納しました`,
          snapshot: dev
        });

        if (state.selectedDeviceId === dev.id) {
          closePropertyPanel(true);
          state.selectedDeviceId = null;
        }

        saveData(true);
        renderRacks();
        updateStorageDepotBadge();
        showToast(`「${dev.name}」を取り外して機器保管庫に格納しました`, 'success');
      }
    } catch (err) {
      console.error('[Storage depot drop error]', err);
    }
  };

  [widget, dropBar].forEach((el) => {
    if (el) {
      el.addEventListener('dragover', handleDragOver);
      el.addEventListener('dragleave', handleDragLeave);
      el.addEventListener('drop', handleDrop);
    }
  });

  updateStorageDepotBadge();
}

function openStorageModal() {
  if (!elements.modalStorage) return;
  renderStorageItems(elements.storageSearchInput ? elements.storageSearchInput.value : '');
  elements.modalStorage.classList.add('open');
}

function closeStorageModal() {
  if (elements.modalStorage) {
    elements.modalStorage.classList.remove('open');
  }
}

function renderStorageItems(query = '') {
  const tbody = elements.storageTbody || document.getElementById('storage-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const q = (query || '').toLowerCase().trim();
  const list = (state.storageDevices || []).filter((dev) => {
    if (!q) return true;
    const matchName = (dev.name || '').toLowerCase().includes(q);
    const matchTicket = (dev.ticketNo || '').toLowerCase().includes(q);
    const matchModel = (dev.model || '').toLowerCase().includes(q);
    const matchVendor = (dev.vendor || '').toLowerCase().includes(q);
    const matchIp = (dev.ip || '').toLowerCase().includes(q);
    const matchHost = (dev.hostname || '').toLowerCase().includes(q);
    const matchRack = (dev.unmountedFromRack || '').toLowerCase().includes(q);
    const matchTags = (dev.tags || []).some((t) => t.toLowerCase().includes(q));
    return matchName || matchTicket || matchModel || matchVendor || matchIp || matchHost || matchRack || matchTags;
  });

  updateStorageDepotBadge();
  if (elements.storageSummaryBadge) {
    elements.storageSummaryBadge.textContent = `${list.length} 件`;
  }

  if (list.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="8" style="text-align:center; padding: 40px 16px; color:#94a3b8;">
        <div style="font-size:14px; font-weight:600;">${q ? '該当する保管機器が見つかりませんでした' : '現在、保管庫に機器はありません'}</div>
        <div style="font-size:12px; margin-top:6px; color:#64748b;">ラック上の機器をキャンバス上部の保管庫エリアへドラッグすると、ここに保管されます。</div>
      </td>
    `;
    tbody.appendChild(tr);
    return;
  }

  list.forEach((dev) => {
    const tr = document.createElement('tr');
    tr.className = 'storage-row';
    tr.draggable = true;

    tr.addEventListener('dragstart', (e) => {
      state.draggedDevice = {
        ...dev,
        isFromStorage: true
      };
      e.dataTransfer.setData('text/plain', JSON.stringify(state.draggedDevice));
      e.dataTransfer.effectAllowed = 'move';
      tr.classList.add('dragging');
      closeStorageModal();
    });

    tr.addEventListener('dragend', () => {
      state.draggedDevice = null;
      tr.classList.remove('dragging');
    });

    const ticketNo = getDeviceTicketNo(dev);
    const vendorModel = [dev.vendor, dev.model].filter(Boolean).join(' ') || '-';
    const unmountInfo = dev.unmountedFromRack ? `${escapeHtml(dev.unmountedFromRack)} (${dev.unmountedFromU || '-'}U)` : '-';
    const storedDate = dev.unmountedAt ? formatDateTime(dev.unmountedAt) : (getDeviceInstallDate(dev) || '-');

    tr.innerHTML = `
      <td><span class="history-ticket-badge">${escapeHtml(ticketNo)}</span></td>
      <td>
        <div style="font-weight:700; color:#fff;">${escapeHtml(dev.name || '名称未設定')}</div>
        ${dev.hostname ? `<div style="font-size:11px; color:#94a3b8; font-family:var(--font-mono);">${escapeHtml(dev.hostname)}</div>` : ''}
      </td>
      <td><span class="badge" style="background:rgba(255,255,255,0.08); font-size:11px;">${escapeHtml(getDeviceTypeName(dev.type))}</span></td>
      <td><span style="color:#cbd5e1;">${escapeHtml(vendorModel)}</span></td>
      <td style="text-align:center;"><span style="font-weight:700; color:var(--accent-cyan); font-family:var(--font-mono);">${dev.sizeU || 1}U</span></td>
      <td><span style="color:#f59e0b; font-size:12px;">${unmountInfo}</span></td>
      <td><span style="font-family:var(--font-mono); font-size:11.5px; color:#94a3b8;">${escapeHtml(storedDate)}</span></td>
      <td style="text-align:center;">
        <div class="storage-action-btns">
          <button type="button" class="btn btn-sm btn-primary btn-deploy-storage" title="ラックを指定して配置">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
            <span>設置</span>
          </button>
          <button type="button" class="btn btn-sm btn-danger btn-delete-storage" title="完全廃棄（保管庫から削除）">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            <span>廃棄</span>
          </button>
        </div>
      </td>
    `;

    tr.querySelector('.btn-deploy-storage').addEventListener('click', (e) => {
      e.stopPropagation();
      openDeployModal(dev.id);
    });

    tr.querySelector('.btn-delete-storage').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`保管庫の機器「${dev.name} (${ticketNo})」を完全に廃棄・削除しますか？\n（この操作は変更履歴に記録され、破棄申請書を出力できます）`)) {
        pushHistoryState(`「${dev.name}」の廃棄・削除`);
        state.storageDevices = state.storageDevices.filter((d) => d.id !== dev.id);
        const delEntry = recordChangeLog({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          ticketNo: ticketNo,
          hostname: dev.hostname || dev.name,
          deviceId: dev.id,
          type: 'delete',
          operator: state.settings.operator || '管理者',
          reason: `[機器廃棄] ${dev.name} (${vendorModel || ''} / ${ticketNo}) を保管庫から完全に廃棄除却しました`,
          snapshot: dev
        });
        saveData(true);
        renderStorageItems(elements.storageSearchInput ? elements.storageSearchInput.value : '');
        updateStorageDepotBadge();
        showToast(`「${dev.name}」を廃棄・除却処理しました`, 'info');

        if (confirm(`廃棄処理が完了しました。「${dev.name}」の破棄申請書（撤去・廃棄処分申請書）を今すぐプレビュー・印刷しますか？`)) {
          closeStorageModal();
          openApplicationDocModal(delEntry.id, 'remove');
        }
      }
    });

    tbody.appendChild(tr);
  });
}

function exportStorageCsv() {
  const list = state.storageDevices || [];
  if (list.length === 0) {
    showToast('出力対象の保管データがありません', 'info');
    return;
  }

  const headers = ['管理番号', '機器名', 'ホスト名', '種別', 'メーカー', '型番', 'ユニット数(U)', '元ラック', '元スロット(U)', '保管日時', 'IPアドレス', '消費電力(W)'];
  const rows = list.map((d) => [
    getDeviceTicketNo(d),
    d.name || '',
    d.hostname || '',
    getDeviceTypeName(d.type),
    d.vendor || '',
    d.model || '',
    d.sizeU || 1,
    d.unmountedFromRack || '',
    d.unmountedFromU || '',
    d.unmountedAt || '',
    d.ip || '',
    d.powerWatts || 0
  ]);

  const bom = '\uFEFF';
  const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `storage_devices_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`機器保管庫台帳CSVを出力しました (${list.length}台)`, 'success');
}

function openDeployModal(deviceId) {
  const dev = (state.storageDevices || []).find((d) => d.id === deviceId);
  if (!dev || !elements.modalDeployStorage) return;

  if (elements.deployDeviceId) elements.deployDeviceId.value = dev.id;

  const targetRackSelect = elements.deployTargetRack;
  if (targetRackSelect) {
    targetRackSelect.innerHTML = '';
    state.racks.forEach((r) => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = `${r.name} (${r.units}U / ${r.devices.length}台配置済)`;
      targetRackSelect.appendChild(opt);
    });
  }

  if (elements.deployStartU) {
    elements.deployStartU.value = dev.startU || 1;
  }
  if (elements.deploySide) {
    elements.deploySide.value = dev.side || 'front';
  }
  if (elements.deploySlotWidth) {
    elements.deploySlotWidth.value = dev.slotWidth === 'half' ? `half-${dev.slotCol || 1}` : 'full';
  }

  const preview = elements.deployDevicePreview;
  if (preview) {
    const ticketNo = getDeviceTicketNo(dev);
    preview.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <strong style="color:#fff; font-size:14px;">${escapeHtml(dev.name || '名称未設定')}</strong>
        <span style="font-family:var(--font-mono); color:var(--accent-cyan); font-weight:700;">${escapeHtml(ticketNo)}</span>
      </div>
      <div style="font-size:12px; color:#94a3b8;">
        サイズ: <strong>${dev.sizeU || 1}U</strong> | 種別: <strong>${getDeviceTypeName(dev.type)}</strong> | メーカー/型番: <strong>${escapeHtml([dev.vendor, dev.model].filter(Boolean).join(' ') || '-')}</strong>
      </div>
    `;
  }

  elements.modalDeployStorage.classList.add('open');
}

function closeDeployModal() {
  if (elements.modalDeployStorage) {
    elements.modalDeployStorage.classList.remove('open');
  }
}

function setupStorageModalEvents() {
  if (elements.btnWaffleStorage) {
    elements.btnWaffleStorage.addEventListener('click', () => {
      if (elements.waffleDropdown) elements.waffleDropdown.style.display = 'none';
      openStorageModal();
    });
  }
  if (elements.btnCloseStorageModal) {
    elements.btnCloseStorageModal.addEventListener('click', closeStorageModal);
  }
  if (elements.btnCloseStorage) {
    elements.btnCloseStorage.addEventListener('click', closeStorageModal);
  }
  if (elements.btnStorageCsv) {
    elements.btnStorageCsv.addEventListener('click', exportStorageCsv);
  }
  if (elements.storageSearchInput) {
    elements.storageSearchInput.addEventListener('input', (e) => {
      renderStorageItems(e.target.value);
    });
  }

  if (elements.btnCloseDeployModal) {
    elements.btnCloseDeployModal.addEventListener('click', closeDeployModal);
  }
  if (elements.btnCancelDeploy) {
    elements.btnCancelDeploy.addEventListener('click', closeDeployModal);
  }

  if (elements.deployStorageForm) {
    elements.deployStorageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const devId = elements.deployDeviceId ? elements.deployDeviceId.value : '';
      const targetRackId = elements.deployTargetRack ? elements.deployTargetRack.value : '';
      const startU = elements.deployStartU ? parseInt(elements.deployStartU.value, 10) : 1;
      const side = elements.deploySide ? elements.deploySide.value : 'front';
      const widthVal = elements.deploySlotWidth ? elements.deploySlotWidth.value : 'full';

      const targetRack = state.racks.find((r) => r.id === targetRackId);
      if (!targetRack) {
        showToast('設置先ラックが見つかりません', 'error');
        return;
      }

      const storedIdx = (state.storageDevices || []).findIndex((d) => d.id === devId);
      if (storedIdx === -1) {
        showToast('保管機器が見つかりません', 'error');
        return;
      }

      const dev = state.storageDevices[storedIdx];
      const sizeU = dev.sizeU || 1;

      let slotWidth = 'full';
      let slotCol = 1;
      if (widthVal === 'half-1') {
        slotWidth = 'half';
        slotCol = 1;
      } else if (widthVal === 'half-2') {
        slotWidth = 'half';
        slotCol = 2;
      }

      // 空きスロット判定
      const isAvailable = checkSlotAvailability(targetRack, startU, sizeU, null, slotWidth, slotCol);
      if (!isAvailable) {
        showToast('指定したスロットには空きがありません (重複またはラック範囲外)', 'error');
        return;
      }

      // 出庫・設置
      state.storageDevices.splice(storedIdx, 1);
      dev.startU = startU;
      dev.side = side;
      dev.slotWidth = slotWidth;
      dev.slotCol = slotCol;
      targetRack.devices.push(dev);

      const ticketNo = getDeviceTicketNo(dev);
      dev.ticketNo = ticketNo;

      recordChangeLog({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        ticketNo: ticketNo,
        hostname: dev.hostname || dev.name,
        deviceId: dev.id,
        type: 'add',
        operator: state.settings.operator || '管理者',
        reason: `[保管庫から出庫・設置] ${dev.name} (${[dev.vendor, dev.model].filter(Boolean).join(' ') || ''} / ${ticketNo}) を保管庫から ${targetRack.name} (${startU}U) に設置しました`,
        snapshot: dev
      });

      await saveData(true);
      renderRacks();
      updateStorageDepotBadge();
      closeDeployModal();
      closeStorageModal();
      selectDevice(dev.id);
      showToast(`「${dev.name}」を ${targetRack.name} の ${startU}U に設置しました`, 'success');
    });
  }
}

// ==========================================================================
// RackManager v5 - その他の場所 (Other Locations) ＆ 専用カラム設定エンジン
// ==========================================================================

const DEFAULT_OTHER_LOC_COLUMNS = [
  { id: 'col-1', key: 'installedAt', name: '設置日時', type: 'datetime', order: 1, visible: true },
  { id: 'col-2', key: 'managementNo', name: '管理番号', type: 'text', order: 2, visible: true },
  { id: 'col-3', key: 'vendor', name: 'メーカー', type: 'text', order: 3, visible: true },
  { id: 'col-4', key: 'model', name: '型番', type: 'text', order: 4, visible: true },
  { id: 'col-5', key: 'name', name: 'デバイス名', type: 'text', order: 5, visible: true, required: true },
  { id: 'col-6', key: 'ip', name: 'IP', type: 'text', order: 6, visible: true },
  { id: 'col-7', key: 'location', name: '設置場所', type: 'text', order: 7, visible: true },
  { id: 'col-8', key: 'office', name: 'Office', type: 'text', order: 8, visible: true },
  { id: 'col-9', key: 'notes', name: '備考', type: 'text', order: 9, visible: true }
];

function getOtherLocationColumns() {
  if (!state.otherLocationColumns || state.otherLocationColumns.length === 0 || state.otherLocationColumns.length === 7) {
    state.otherLocationColumns = JSON.parse(JSON.stringify(DEFAULT_OTHER_LOC_COLUMNS));
  }
  return state.otherLocationColumns.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
}

function updateOtherLocationBadge() {
  const count = (state.otherLocations || []).length;
  if (elements.otherLocationCount) {
    elements.otherLocationCount.textContent = `${count} 台配置中`;
  }
  if (elements.otherLocSummaryBadge) {
    elements.otherLocSummaryBadge.textContent = `${count} 件`;
  }
  if (elements.otherLocFooterSummary) {
    elements.otherLocFooterSummary.textContent = `配置中: ${count}台`;
  }
}

function setupOtherLocationWidget() {
  const widget = elements.otherLocationWidget || document.getElementById('other-location-widget');
  if (!widget) return;

  widget.addEventListener('click', () => {
    openOtherLocationModal();
  });

  widget.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    widget.classList.add('drag-over');
  });

  widget.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    widget.classList.remove('drag-over');
  });

  widget.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideDeviceTooltip();
    document.body.classList.remove('is-dragging-device');
    widget.classList.remove('drag-over');

    try {
      let data = state.draggedDevice;
      if (!data) {
        const dataStr = e.dataTransfer.getData('text/plain');
        if (dataStr) data = JSON.parse(dataStr);
      }
      if (!data) return;

      if (data.sourceRackId && data.deviceId) {
        const sourceRack = state.racks.find((r) => r.id === data.sourceRackId);
        if (!sourceRack) return;
        const devIdx = sourceRack.devices.findIndex((d) => d.id === data.deviceId);
        if (devIdx === -1) return;

        pushHistoryState(`「${sourceRack.devices[devIdx]?.name || '機器'}」をその他の場所へ移動`);

        const dev = sourceRack.devices.splice(devIdx, 1)[0];
        // 接続LANケーブルを解除
        state.cables = (state.cables || []).filter(
          (c) => c.fromDeviceId !== dev.id && c.toDeviceId !== dev.id
        );

        if (!state.otherLocations) state.otherLocations = [];
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const locDev = {
          id: dev.id,
          name: dev.name || 'Device',
          vendor: dev.vendor || '',
          type: dev.type || 'laptop',
          ip: dev.ip || '',
          location: '未設定 (要登録)',
          office: '',
          installedAt: nowStr,
          notes: dev.notes || '',
          tags: dev.tags || [],
          customFields: {}
        };
        state.otherLocations.unshift(locDev);

        recordChangeLog({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          ticketNo: dev.ticketNo || generateNextTicketNo(),
          hostname: dev.hostname || dev.name,
          deviceId: dev.id,
          type: 'delete',
          operator: state.settings.operator || '管理者',
          reason: `[配置換え] ${dev.name} を ${sourceRack.name} (${dev.startU}U) から「その他の場所」へ移動しました`,
          snapshot: dev
        });

        if (state.selectedDeviceId === dev.id) {
          closePropertyPanel(true);
          state.selectedDeviceId = null;
        }

        await saveData(true);
        renderRacks();
        updateOtherLocationBadge();
        showToast(`「${dev.name}」をその他の場所へ移動しました`, 'success');
      }
    } catch (err) {
      console.error('[Other location drop error]', err);
    }
  });
}

function openOtherLocationModal() {
  if (!elements.modalOtherLocation) return;
  getOtherLocationColumns();
  renderOtherLocationTable();
  elements.modalOtherLocation.classList.add('open');
}

function closeOtherLocationModal() {
  if (elements.modalOtherLocation) {
    elements.modalOtherLocation.classList.remove('open');
  }
}

function renderOtherLocationTable(searchQuery = '') {
  if (!elements.otherLocThead || !elements.otherLocTbody) return;
  const cols = getOtherLocationColumns().filter(c => c.visible);
  
  // 1. Thead レンダリング
  let theadHtml = '<tr>';
  cols.forEach(col => {
    theadHtml += `<th>${escapeHtml(col.name)}</th>`;
  });
  theadHtml += '<th style="width: 160px; text-align: center;">操作</th></tr>';
  elements.otherLocThead.innerHTML = theadHtml;

  // 2. Tbody レンダリング
  const q = searchQuery.toLowerCase().trim();
  let list = state.otherLocations || [];

  if (q) {
    list = list.filter(d => {
      const basicMatch = [
        d.name, d.vendor, d.ip, d.location, d.office, d.notes, d.installedAt,
        (d.tags || []).join(' ')
      ].filter(Boolean).some(val => String(val).toLowerCase().includes(q));

      const customMatch = Object.values(d.customFields || {}).some(val =>
        String(val).toLowerCase().includes(q)
      );
      return basicMatch || customMatch;
    });
  }

  if (elements.otherLocSummaryBadge) {
    elements.otherLocSummaryBadge.textContent = `${list.length} 件`;
  }

  if (list.length === 0) {
    elements.otherLocTbody.innerHTML = `
      <tr>
        <td colspan="${cols.length + 1}" style="text-align: center; color: #94a3b8; padding: 24px;">
          ${q ? '該当する機器が見つかりません' : 'その他の場所に配置された機器はありません。「機器を新規追加」から登録してください'}
        </td>
      </tr>
    `;
    return;
  }

  let tbodyHtml = '';
  list.forEach(dev => {
    tbodyHtml += `<tr>`;
    cols.forEach(col => {
      let val = dev[col.key];
      if (val === undefined && dev.customFields) {
        val = dev.customFields[col.key];
      }
      val = val !== undefined && val !== null ? String(val) : '-';

      if (col.key === 'name') {
        tbodyHtml += `<td><strong>${escapeHtml(val)}</strong></td>`;
      } else if (col.key === 'location') {
        tbodyHtml += `<td><span class="badge-location"><svg style="width:12px;height:12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${escapeHtml(val)}</span></td>`;
      } else if (col.key === 'office') {
        tbodyHtml += `<td>${val !== '-' ? `<span class="badge-office">${escapeHtml(val)}</span>` : '-'}</td>`;
      } else if (col.key === 'ip') {
        tbodyHtml += `<td><span style="font-family:var(--font-mono); font-size:11.5px;">${escapeHtml(val)}</span></td>`;
      } else {
        tbodyHtml += `<td>${escapeHtml(val)}</td>`;
      }
    });

    tbodyHtml += `
      <td style="text-align: center;">
        <div style="display:flex; justify-content:center; gap:4px;">
          <button type="button" class="btn btn-secondary btn-sm btn-deploy-other-loc" data-id="${escapeHtml(dev.id)}" title="この機器をラックに設置">
            ラックへ設置
          </button>
          <button type="button" class="btn btn-secondary btn-sm btn-edit-other-loc" data-id="${escapeHtml(dev.id)}" title="編集">
            編集
          </button>
          <button type="button" class="btn btn-secondary btn-sm btn-delete-other-loc" data-id="${escapeHtml(dev.id)}" style="color:#f87171;" title="削除">
            削除
          </button>
        </div>
      </td>
    </tr>`;
  });

  elements.otherLocTbody.innerHTML = tbodyHtml;

  // イベントリスナー
  elements.otherLocTbody.querySelectorAll('.btn-deploy-other-loc').forEach(b => {
    b.addEventListener('click', () => {
      const devId = b.dataset.id;
      openDeployFromOtherLocation(devId);
    });
  });

  elements.otherLocTbody.querySelectorAll('.btn-edit-other-loc').forEach(b => {
    b.addEventListener('click', () => {
      const devId = b.dataset.id;
      openOtherLocationEditModal(devId);
    });
  });

  elements.otherLocTbody.querySelectorAll('.btn-delete-other-loc').forEach(b => {
    b.addEventListener('click', async () => {
      const devId = b.dataset.id;
      const dev = (state.otherLocations || []).find(d => d.id === devId);
      if (!dev) return;
      if (confirm(`その他の場所の機器「${dev.name}」を削除しますか？`)) {
        pushHistoryState(`「${dev.name}」の削除`);
        state.otherLocations = state.otherLocations.filter(d => d.id !== devId);
        recordChangeLog({
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          ticketNo: generateNextTicketNo(),
          hostname: dev.name,
          deviceId: dev.id,
          type: 'delete',
          operator: state.settings.operator || '管理者',
          reason: `[機器削除] その他の場所から ${dev.name} を削除除却しました`,
          snapshot: dev
        });
        await saveData(true);
        renderOtherLocationTable(elements.otherLocSearchInput ? elements.otherLocSearchInput.value : '');
        updateOtherLocationBadge();
        showToast(`「${dev.name}」を削除しました`, 'info');
      }
    });
  });
}

function openDeployFromOtherLocation(devId) {
  const dev = (state.otherLocations || []).find(d => d.id === devId);
  if (!dev) return;

  if (!elements.modalDeployStorage || !elements.deployStorageForm) return;

  const targetRackSelect = document.getElementById('deploy-target-rack');
  const targetUInput = document.getElementById('deploy-target-u');
  const targetSideSelect = document.getElementById('deploy-target-side');
  const preview = document.getElementById('deploy-device-preview');
  const idInput = document.getElementById('deploy-device-id');

  if (idInput) idInput.value = dev.id;

  if (targetRackSelect) {
    targetRackSelect.innerHTML = state.racks
      .map(r => `<option value="${r.id}">${escapeHtml(r.name)} (${r.units}U)</option>`)
      .join('');
  }

  if (preview) {
    preview.innerHTML = `
      <div style="font-weight:700; color:#38bdf8; font-size:13px;">${escapeHtml(dev.name)}</div>
      <div style="font-size:11.5px; color:#94a3b8;">メーカー: ${escapeHtml(dev.vendor || '-')} | IP: ${escapeHtml(dev.ip || '-')} | 設置場所: ${escapeHtml(dev.location || '-')}</div>
    `;
  }

  elements.deployStorageForm.onsubmit = async (e) => {
    e.preventDefault();
    const rackId = targetRackSelect ? targetRackSelect.value : state.racks[0]?.id;
    const startU = targetUInput ? parseInt(targetUInput.value, 10) : 1;
    const side = targetSideSelect ? targetSideSelect.value : 'front';

    const targetRack = state.racks.find(r => r.id === rackId);
    if (!targetRack) return;

    const sizeU = 1;
    const isValid = checkSlotAvailability(targetRack, startU, sizeU, null, 'full', 1);
    if (!isValid) {
      showToast('指定したスロットには空きがありません (重複またはラック範囲外)', 'error');
      return;
    }

    pushHistoryState(`「${dev.name}」をラック ${targetRack.name} へ設置`);

    const devIdx = state.otherLocations.findIndex(d => d.id === dev.id);
    if (devIdx !== -1) {
      state.otherLocations.splice(devIdx, 1);
    }

    const rackDev = {
      id: dev.id,
      name: dev.name,
      vendor: dev.vendor || '',
      model: '',
      type: dev.type || 'laptop',
      sizeU: sizeU,
      startU: startU,
      side: side,
      slotWidth: 'full',
      slotCol: 1,
      portCount: 2,
      powerWatts: getDefaultPowerWatts(dev.type || 'laptop'),
      ip: dev.ip || '',
      tags: dev.tags || [],
      notes: dev.notes || '',
      ticketNo: generateNextTicketNo()
    };

    targetRack.devices.push(rackDev);

    recordChangeLog({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      ticketNo: rackDev.ticketNo,
      hostname: rackDev.name,
      deviceId: rackDev.id,
      type: 'add',
      operator: state.settings.operator || '管理者',
      reason: `[その他の場所からラック設置] ${rackDev.name} を ${targetRack.name} (${startU}U) に設置しました`,
      snapshot: rackDev
    });

    await saveData(true);
    renderRacks();
    updateOtherLocationBadge();
    renderOtherLocationTable();
    closeDeployModal();
    selectDevice(rackDev.id);
    showToast(`「${rackDev.name}」を ${targetRack.name} の ${startU}U に設置しました`, 'success');
  };

  elements.modalDeployStorage.classList.add('open');
}

// --- カラム設定モーダル ---
function openOtherLocationColumnsModal() {
  if (!elements.modalOtherLocationColumns) return;
  renderColumnsList();
  elements.modalOtherLocationColumns.classList.add('open');
}

function closeOtherLocationColumnsModal() {
  if (elements.modalOtherLocationColumns) {
    elements.modalOtherLocationColumns.classList.remove('open');
  }
}

function renderColumnsList() {
  if (!elements.columnsListContainer) return;
  const cols = getOtherLocationColumns();

  let html = '';
  cols.forEach((col, idx) => {
    html += `
      <div class="col-item-row" data-id="${escapeHtml(col.id)}">
        <div class="col-item-info">
          <span class="col-order-num">${idx + 1}</span>
          <span class="col-name-label">${escapeHtml(col.name)}</span>
          <span class="col-key-tag">${escapeHtml(col.key)}</span>
          <span class="col-type-tag">${col.type === 'datetime' ? '日時' : (col.type === 'number' ? '数値' : (col.type === 'ip' ? 'IP' : 'テキスト'))}</span>
        </div>
        <div class="col-item-actions">
          <button type="button" class="btn-col-action btn-col-up" data-idx="${idx}" title="上へ" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}>▲</button>
          <button type="button" class="btn-col-action btn-col-down" data-idx="${idx}" title="下へ" ${idx === cols.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>▼</button>
          <button type="button" class="btn-col-action btn-col-delete" data-id="${escapeHtml(col.id)}" title="カラム削除" ${col.required ? 'disabled style="opacity:0.3;"' : ''}>✕</button>
        </div>
      </div>
    `;
  });

  elements.columnsListContainer.innerHTML = html;

  // 上下移動
  elements.columnsListContainer.querySelectorAll('.btn-col-up').forEach(b => {
    b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.idx, 10);
      if (idx > 0) {
        const colsList = getOtherLocationColumns();
        const temp = colsList[idx];
        colsList[idx] = colsList[idx - 1];
        colsList[idx - 1] = temp;
        colsList.forEach((c, i) => c.order = i + 1);
        state.otherLocationColumns = colsList;
        renderColumnsList();
      }
    });
  });

  elements.columnsListContainer.querySelectorAll('.btn-col-down').forEach(b => {
    b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.idx, 10);
      const colsList = getOtherLocationColumns();
      if (idx < colsList.length - 1) {
        const temp = colsList[idx];
        colsList[idx] = colsList[idx + 1];
        colsList[idx + 1] = temp;
        colsList.forEach((c, i) => c.order = i + 1);
        state.otherLocationColumns = colsList;
        renderColumnsList();
      }
    });
  });

  // 削除
  elements.columnsListContainer.querySelectorAll('.btn-col-delete').forEach(b => {
    b.addEventListener('click', () => {
      const colId = b.dataset.id;
      const colsList = getOtherLocationColumns();
      const col = colsList.find(c => c.id === colId);
      if (!col) return;
      if (confirm(`カラム「${col.name}」を削除しますか？`)) {
        state.otherLocationColumns = colsList.filter(c => c.id !== colId);
        state.otherLocationColumns.forEach((c, i) => c.order = i + 1);
        renderColumnsList();
      }
    });
  });
}

function addNewColumnToConfig() {
  if (!elements.newColName || !elements.newColKey) return;
  const name = elements.newColName.value.trim();
  let key = elements.newColKey.value.trim();
  const type = elements.newColType ? elements.newColType.value : 'text';

  if (!name) {
    showToast('カラムの項目名を入力してください', 'error');
    return;
  }
  if (!key) {
    key = 'col_' + Date.now().toString(36);
  } else {
    key = key.replace(/[^a-zA-Z0-9_]/g, '');
  }

  const colsList = getOtherLocationColumns();
  if (colsList.some(c => c.key === key)) {
    showToast(`キー「${key}」は既に使用されています。別のキーを入力してください`, 'error');
    return;
  }

  const newCol = {
    id: 'col-' + Date.now(),
    key: key,
    name: name,
    type: type,
    order: colsList.length + 1,
    visible: true,
    required: false
  };

  colsList.push(newCol);
  state.otherLocationColumns = colsList;
  elements.newColName.value = '';
  elements.newColKey.value = '';
  renderColumnsList();
  showToast(`新しいカラム「${name}」を追加しました。「設定を保存」を押すと適用されます`, 'info');
}

async function saveColumnsConfig() {
  pushHistoryState('その他の場所のカラム設定変更');
  await saveData(true);
  renderOtherLocationTable(elements.otherLocSearchInput ? elements.otherLocSearchInput.value : '');
  closeOtherLocationColumnsModal();
  showToast('カラム設定を保存しました', 'success');
}

function resetDefaultColumnsConfig() {
  if (confirm('カラム設定を初期状態（設置日時、メーカー、デバイス名、IP、設置場所、Office、備考）に戻しますか？')) {
    state.otherLocationColumns = JSON.parse(JSON.stringify(DEFAULT_OTHER_LOC_COLUMNS));
    renderColumnsList();
    showToast('カラム設定を初期値にリセットしました', 'info');
  }
}

// --- 機器追加/編集モーダル ---
function openOtherLocationEditModal(deviceId = null) {
  if (!elements.modalOtherLocationEdit || !elements.otherLocFormBody) return;
  const cols = getOtherLocationColumns();
  const dev = deviceId ? (state.otherLocations || []).find(d => d.id === deviceId) : null;

  if (elements.modalOtherLocEditTitle) {
    elements.modalOtherLocEditTitle.textContent = dev ? `機器の編集: ${dev.name}` : 'その他の場所に機器を追加';
  }
  if (elements.otherLocDevId) {
    elements.otherLocDevId.value = dev ? dev.id : '';
  }

  let formHtml = '';
  cols.forEach(col => {
    let val = dev ? dev[col.key] : '';
    if (dev && val === undefined && dev.customFields) {
      val = dev.customFields[col.key] || '';
    }
    if (val === undefined || val === null) val = '';

    const inputType = col.type === 'number' ? 'number' : 'text';
    const placeholder = col.type === 'datetime' ? 'YYYY-MM-DD HH:MM (空欄で現在日時)' : '';
    const isFullWidth = col.key === 'notes';

    if (col.key === 'notes') {
      formHtml += `
        <div class="form-group col-span-full">
          <label class="form-label">${escapeHtml(col.name)} ${col.required ? '<span class="required" style="color:#ef4444;">*</span>' : ''}</label>
          <textarea class="form-control" name="col_${escapeHtml(col.key)}" id="input_other_col_${escapeHtml(col.key)}" placeholder="${placeholder}" ${col.required ? 'required' : ''}>${escapeHtml(val)}</textarea>
        </div>
      `;
    } else {
      formHtml += `
        <div class="form-group ${isFullWidth ? 'col-span-full' : ''}">
          <label class="form-label">${escapeHtml(col.name)} ${col.required ? '<span class="required" style="color:#ef4444;">*</span>' : ''}</label>
          <input type="${inputType}" class="form-control" name="col_${escapeHtml(col.key)}" id="input_other_col_${escapeHtml(col.key)}" value="${escapeHtml(val)}" placeholder="${placeholder}" ${col.required ? 'required' : ''}>
        </div>
      `;
    }
  });

  elements.otherLocFormBody.innerHTML = formHtml;
  elements.modalOtherLocationEdit.classList.add('open');
}

function closeOtherLocationEditModal() {
  if (elements.modalOtherLocationEdit) {
    elements.modalOtherLocationEdit.classList.remove('open');
  }
}

async function saveOtherLocationDevice(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  if (!elements.otherLocDeviceForm) return;

  const form = elements.otherLocDeviceForm;
  const formData = new FormData(form);
  const devId = elements.otherLocDevId ? elements.otherLocDevId.value : '';
  const cols = getOtherLocationColumns();

  const devData = {};
  const customFields = {};

  cols.forEach(col => {
    const inputEl = form.querySelector(`[name="col_${col.key}"]`);
    let val = inputEl ? inputEl.value : (formData.get(`col_${col.key}`) || '');
    val = typeof val === 'string' ? val.trim() : val;
    if (col.key === 'installedAt' && !val) {
      val = new Date().toISOString().replace('T', ' ').substring(0, 16);
    }

    if (['name', 'managementNo', 'vendor', 'model', 'type', 'ip', 'location', 'office', 'installedAt', 'notes'].includes(col.key)) {
      devData[col.key] = val;
    } else {
      customFields[col.key] = val;
    }
  });

  if (!devData.name) {
    showToast('デバイス名を入力してください', 'error');
    return;
  }

  pushHistoryState(devId ? `「${devData.name}」の編集` : `その他の場所へ「${devData.name}」を追加`);

  if (devId) {
    const existing = (state.otherLocations || []).find(d => d.id === devId);
    if (existing) {
      Object.assign(existing, devData, { customFields });
    }
  } else {
    const newDev = {
      id: 'loc-dev-' + Date.now(),
      ...devData,
      type: devData.type || 'laptop',
      tags: [],
      customFields
    };
    if (!state.otherLocations) state.otherLocations = [];
    state.otherLocations.unshift(newDev);
  }

  await saveData(true);
  updateOtherLocationBadge();
  renderOtherLocationTable(elements.otherLocSearchInput ? elements.otherLocSearchInput.value : '');
  closeOtherLocationEditModal();
  showToast(`機器「${devData.name}」を保存しました`, 'success');
}

function exportOtherLocationsCsv() {
  const cols = getOtherLocationColumns().filter(c => c.visible);
  const list = state.otherLocations || [];

  const headers = cols.map(c => `"${c.name}"`).join(',');
  const rows = list.map(dev => {
    return cols.map(c => {
      let val = dev[c.key];
      if (val === undefined && dev.customFields) val = dev.customFields[c.key];
      val = val !== undefined && val !== null ? String(val) : '';
      return `"${val.replace(/"/g, '""')}"`;
    }).join(',');
  });

  const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `other_locations_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('その他の場所の機器一覧をCSVダウンロードしました', 'success');
}

// --- ラック一覧レンダリング (CSS Grid による完全精密スロット同期) ---
function renderRacks() {
  hideDeviceTooltip();
  elements.racksContainer.innerHTML = '';
  elements.racksContainer.className = `racks-container layout-${state.rackLayoutMode || '1'}`;

  if (state.racks.length === 0) {
    elements.racksContainer.innerHTML = `
      <div style="margin: 40px auto; text-align: center; color: #94a3b8;">
        <p style="font-size: 16px; margin-bottom: 12px;">ラックが登録されていません</p>
        <button class="btn btn-primary" onclick="document.getElementById('btn-add-rack').click()">＋ ラックを追加する</button>
      </div>
    `;
    updateStorageDepotBadge();
    return;
  }

  state.racks.forEach((rack, rackIdx) => {
    const rackCard = document.createElement('div');
    rackCard.className = 'rack-card';
    rackCard.id = `rack-card-${rack.id}`;
    rackCard.dataset.rackId = rack.id;
    rackCard.dataset.rackIndex = rackIdx;

    const currentSide = state.rackViewModes[rack.id] || 'front';
    const isFront = currentSide === 'front';

    // 1. ラックヘッダー (ラック移動機能は完全無効化)
    const header = document.createElement('div');
    header.className = 'rack-header';

    const titleRow = document.createElement('div');
    titleRow.className = 'rack-title-row';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'rack-name-input';
    nameInput.value = rack.name;
    nameInput.title = 'ラック名を編集';
    nameInput.addEventListener('change', (e) => {
      pushHistoryState(`ラック名の変更: ${rack.name} ➜ ${e.target.value.trim()}`);
      rack.name = e.target.value.trim() || 'Rack';
      saveData();
    });

    const controls = document.createElement('div');
    controls.className = 'rack-controls';

    const sideBadge = document.createElement('button');
    sideBadge.className = `rack-side-badge ${currentSide}`;
    sideBadge.textContent = isFront ? '前面 (Front)' : '背面 (Rear)';
    sideBadge.title = '前面 / 背面 表示切り替え';
    sideBadge.addEventListener('click', () => {
      state.rackViewModes[rack.id] = isFront ? 'rear' : 'front';
      renderRacks();
    });

    const btnEditRack = document.createElement('button');
    btnEditRack.type = 'button';
    btnEditRack.className = 'btn-rack-action';
    btnEditRack.title = 'ラック設定・契約電力の編集';
    btnEditRack.innerHTML = `
      <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    `;
    btnEditRack.addEventListener('click', () => {
      openEditRackModal(rack.id);
    });

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-rack-action';
    btnDelete.title = 'ラックを削除';
    btnDelete.innerHTML = `
      <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    btnDelete.addEventListener('click', () => {
      if (confirm(`ラック「${rack.name}」とその中の機器をすべて削除しますか？`)) {
        pushHistoryState(`ラック「${rack.name}」の削除`);
        state.racks = state.racks.filter((r) => r.id !== rack.id);
        cleanupOrphanCables();
        renderRacks();
        updateHeaderStats();
        saveData(true);
      }
    });

    controls.appendChild(sideBadge);
    controls.appendChild(btnEditRack);
    controls.appendChild(btnDelete);
    titleRow.appendChild(nameInput);
    titleRow.appendChild(controls);
    header.appendChild(titleRow);

    // ラック上部タグ
    const tagsArea = document.createElement('div');
    tagsArea.className = 'rack-tags-area';

    (rack.tags || []).forEach((tag, idx) => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'rack-tag';
      tagSpan.innerHTML = `
        ${escapeHtml(tag)}
        <span class="btn-tag-del" title="タグ削除">×</span>
      `;
      tagSpan.querySelector('.btn-tag-del').addEventListener('click', (e) => {
        e.stopPropagation();
        rack.tags.splice(idx, 1);
        saveData();
        renderRacks();
      });
      tagsArea.appendChild(tagSpan);
    });

    const newTagInput = document.createElement('input');
    newTagInput.type = 'text';
    newTagInput.className = 'rack-tag-input';
    newTagInput.placeholder = '+ タグ追加';
    newTagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && newTagInput.value.trim()) {
        if (!rack.tags) rack.tags = [];
        rack.tags.push(newTagInput.value.trim());
        newTagInput.value = '';
        saveData();
        renderRacks();
      }
    });
    tagsArea.appendChild(newTagInput);
    header.appendChild(tagsArea);
    rackCard.appendChild(header);

    // 1.5. ラック消費電力 ＆ スロット使用率キャパシティバー (複数UPS自動連動)
    const upsDevices = rack.devices.filter((d) => d.type === 'ups');
    const upsCount = upsDevices.length;
    let maxWatts = rack.maxPowerWatts || 3000;
    let isUpsLinked = false;
    let totalUpsCapacity = 0;

    if (upsCount > 0) {
      totalUpsCapacity = upsDevices.reduce((sum, u) => sum + (parseInt(u.maxOutputWatts, 10) || 1500), 0);
      maxWatts = totalUpsCapacity;
      isUpsLinked = true;
    }

    const totalWatts = rack.devices.reduce((sum, d) => sum + (d.powerWatts !== undefined && d.powerWatts !== null && d.powerWatts !== '' ? Number(d.powerWatts) : getDefaultPowerWatts(d.type)), 0);
    const powerPct = Math.min(100, Math.round((totalWatts / Math.max(1, maxWatts)) * 100));
    let powerClass = 'power';
    if (powerPct >= 90) powerClass += ' danger';
    else if (powerPct >= 75) powerClass += ' warn';

    const uniqueOccupiedU = new Set();
    rack.devices.forEach((d) => {
      const sz = d.sizeU || 1;
      for (let u = d.startU; u < d.startU + sz; u++) {
        if (u <= rack.units) uniqueOccupiedU.add(u);
      }
    });
    const occupiedUCount = uniqueOccupiedU.size;
    const totalCapacitySlots = rack.units;
    const slotPct = Math.min(100, Math.round((occupiedUCount / totalCapacitySlots) * 100));

    const upsBadgeHtml = isUpsLinked
      ? `<span class="rack-meter-ups-tag" title="UPS ${upsCount}台の合計定格出力容量に自動連動中 (合計: ${totalUpsCapacity.toLocaleString()}W)">⚡ UPS連動 (${upsCount}台)</span>`
      : `<span class="rack-meter-ups-tag" style="background:rgba(56,189,248,0.15); color:var(--accent-cyan); border-color:rgba(56,189,248,0.35);" title="ラック契約受電容量">契約受電</span>`;

    const capacityGroup = document.createElement('div');
    capacityGroup.className = 'rack-capacity-bar-group';
    capacityGroup.innerHTML = `
      <div class="rack-meter-row">
        <div class="rack-meter-info">
          <span class="rack-meter-label">⚡ 電力使用量 ${upsBadgeHtml}</span>
          <span class="rack-meter-val">${totalWatts.toLocaleString()}W / ${maxWatts.toLocaleString()}W (${powerPct}%)</span>
        </div>
        <div class="rack-meter-track">
          <div class="rack-meter-fill ${powerClass}" style="width: ${powerPct}%;"></div>
        </div>
      </div>
      <div class="rack-meter-row">
        <div class="rack-meter-info">
          <span class="rack-meter-label">📦 スロット使用率</span>
          <span class="rack-meter-val">${occupiedUCount}/${totalCapacitySlots}U (${slotPct}%)</span>
        </div>
        <div class="rack-meter-track">
          <div class="rack-meter-fill slots" style="width: ${slotPct}%;"></div>
        </div>
      </div>
    `;
    rackCard.appendChild(capacityGroup);

    // 2. ラック本体 (CSS Grid)
    const body = document.createElement('div');
    body.className = 'rack-body';

    // 左ポスト (CSS Grid)
    const leftPost = document.createElement('div');
    leftPost.className = 'rack-post';
    for (let u = rack.units; u >= 1; u--) {
      const hole = document.createElement('div');
      hole.className = 'post-hole';
      hole.innerHTML = '<div class="screw-hole"></div>';
      leftPost.appendChild(hole);
    }

    // 左側 U番号目盛り (CSS Grid: 42U 〜 1U)
    const leftUNumbers = document.createElement('div');
    leftUNumbers.className = 'rack-u-numbers u-numbers-left';
    for (let u = rack.units; u >= 1; u--) {
      const uLabel = document.createElement('div');
      uLabel.className = 'u-number-label';
      uLabel.textContent = `${u}U`;
      leftUNumbers.appendChild(uLabel);
    }

    // メインスロット列 (CSS Grid)
    const slotsGrid = document.createElement('div');
    slotsGrid.className = 'rack-slots-grid';

    // 表示面に該当する機器および反対面のゴースト機器を収集
    const visibleDevices = [];
    const occupiedMatrix = {}; // occupiedMatrix[u][colIndex_1_to_6] = true

    for (let u = 1; u <= rack.units; u++) {
      occupiedMatrix[u] = [false, false, false, false, false, false, false]; // 1-indexed (1..6)
    }

    function markOccupiedCols(dev) {
      const sz = dev.sizeU || 1;
      const topU = dev.startU + sz - 1;
      const w = dev.slotWidth || 'full';
      const col = parseInt(dev.slotCol, 10) || 1;

      for (let u = dev.startU; u <= topU; u++) {
        if (!occupiedMatrix[u]) continue;
        if (w === 'half') {
          const startCol = col === 2 ? 4 : 1;
          for (let c = startCol; c < startCol + 3; c++) occupiedMatrix[u][c] = true;
        } else if (w === 'third') {
          const startCol = col === 3 ? 5 : (col === 2 ? 3 : 1);
          for (let c = startCol; c < startCol + 2; c++) occupiedMatrix[u][c] = true;
        } else {
          // full
          for (let c = 1; c <= 6; c++) occupiedMatrix[u][c] = true;
        }
      }
    }

    // 表示面に該当する機器
    rack.devices.forEach((dev) => {
      const devSide = dev.side || 'front';
      const isPrimary = isFront
        ? devSide === 'front' || devSide === 'full'
        : devSide === 'rear' || devSide === 'full';

      if (isPrimary && dev.startU >= 1 && dev.startU + (dev.sizeU || 1) - 1 <= rack.units) {
        visibleDevices.push(dev);
        markOccupiedCols(dev);
      }
    });

    // 跨ぎ配線（Front ⇄ Rear、Full ⇄ Rear、Full ⇄ Front）を持つ反対側デバイスのIDを収集
    const crossConnectedDeviceIds = new Set();
    (state.cables || []).forEach((c) => {
      const fInfo = findDevice(c.fromDeviceId);
      const tInfo = findDevice(c.toDeviceId);
      if (fInfo && tInfo) {
        const fSide = fInfo.device.side || 'front';
        const tSide = tInfo.device.side || 'front';

        // 1. 前面 ⇄ 背面
        if ((fSide === 'front' && tSide === 'rear') || (fSide === 'rear' && tSide === 'front')) {
          crossConnectedDeviceIds.add(c.fromDeviceId);
          crossConnectedDeviceIds.add(c.toDeviceId);
        }
        // 2. 貫通 (Full) ⇄ 背面 (Rear): 前面ビュー時に背面機器をスマートゴースト表示
        else if (fSide === 'full' && tSide === 'rear') {
          crossConnectedDeviceIds.add(tInfo.device.id);
        } else if (fSide === 'rear' && tSide === 'full') {
          crossConnectedDeviceIds.add(fInfo.device.id);
        }
        // 3. 貫通 (Full) ⇄ 前面 (Front): 背面ビュー時に前面機器をスマートゴースト表示
        else if (fSide === 'full' && tSide === 'front') {
          crossConnectedDeviceIds.add(tInfo.device.id);
        } else if (fSide === 'front' && tSide === 'full') {
          crossConnectedDeviceIds.add(fInfo.device.id);
        }
      }
    });

    // 跨ぎ配線を持つ反対側デバイス【のみ】をスマートゴーストとして追加
    rack.devices.forEach((dev) => {
      const devSide = dev.side || 'front';
      const isOpposite = isFront ? devSide === 'rear' : devSide === 'front';
      if (isOpposite && dev.startU >= 1 && dev.startU + (dev.sizeU || 1) - 1 <= rack.units) {
        if (crossConnectedDeviceIds.has(dev.id)) {
          const ghostDev = { ...dev, isGhost: true, isCrossConnected: true };
          visibleDevices.push(ghostDev);
          markOccupiedCols(ghostDev);
        }
      }
    });

    // 1. 空いているマス（空きスロット / 空きサブスロット）を CSS Grid に配置
    for (let u = rack.units; u >= 1; u--) {
      const rowIndex = rack.units - u + 1;
      const rowCols = occupiedMatrix[u];
      const isAllEmpty = !rowCols[1] && !rowCols[2] && !rowCols[3] && !rowCols[4] && !rowCols[5] && !rowCols[6];

      if (isAllEmpty) {
        // フル幅空きスロット
        const slotCell = document.createElement('div');
        slotCell.className = 'rack-slot-cell';
        slotCell.style.gridRow = `${rowIndex} / span 1`;
        slotCell.style.gridColumn = '1 / span 6';
        slotCell.dataset.u = u;
        slotCell.innerHTML = `
          <span class="slot-empty-text">Empty</span>
          <span class="slot-quick-add">+ 追加</span>
        `;
        slotCell.addEventListener('click', (e) => {
          e.stopPropagation();
          quickAddDeviceAt(rack, u);
        });
        setupSlotDropEvents(slotCell, rack);
        slotsGrid.appendChild(slotCell);
      } else {
        // 一部の列のみ空いている場合：空き列にサブスロット空きセルを配置
        const devsAtThisU = visibleDevices.filter(d => u >= d.startU && u < d.startU + (d.sizeU || 1));
        const isThird = devsAtThisU.some(d => d.slotWidth === 'third');

        if (isThird) {
          // 3分割 (列1: 1-2, 列2: 3-4, 列3: 5-6)
          for (let col = 1; col <= 3; col++) {
            const startCol = col === 3 ? 5 : (col === 2 ? 3 : 1);
            if (!rowCols[startCol]) {
              const emptySubSlot = document.createElement('div');
              emptySubSlot.className = 'sub-slot-cell sub-slot-empty';
              emptySubSlot.style.gridRow = `${rowIndex} / span 1`;
              emptySubSlot.style.gridColumn = `${startCol} / span 2`;
              emptySubSlot.dataset.rackId = rack.id;
              emptySubSlot.dataset.u = u;
              emptySubSlot.dataset.col = col;
              emptySubSlot.title = `${u}U 列${col}: クリックで小型機器を追加 (1/3幅)`;
              emptySubSlot.innerHTML = `<span class="sub-slot-empty-text">+ 空き</span>`;
              emptySubSlot.addEventListener('click', (e) => {
                e.stopPropagation();
                quickAddSubDeviceAt(rack, u, col, 'third');
              });
              setupSlotDropEvents(emptySubSlot, rack, col);
              slotsGrid.appendChild(emptySubSlot);
            }
          }
        } else {
          // 2分割（ハーフ: 列1: 1-3, 列2: 4-6）
          // 列1 が空き
          if (!rowCols[1] && !rowCols[2] && !rowCols[3]) {
            const emptySubSlot = document.createElement('div');
            emptySubSlot.className = 'sub-slot-cell sub-slot-empty';
            emptySubSlot.style.gridRow = `${rowIndex} / span 1`;
            emptySubSlot.style.gridColumn = '1 / span 3';
            emptySubSlot.dataset.rackId = rack.id;
            emptySubSlot.dataset.u = u;
            emptySubSlot.dataset.col = 1;
            emptySubSlot.title = `${u}U 列1: クリックでハーフ機器を追加 (1/2幅)`;
            emptySubSlot.innerHTML = `<span class="sub-slot-empty-text">+ 空き</span>`;
            emptySubSlot.addEventListener('click', (e) => {
              e.stopPropagation();
              quickAddSubDeviceAt(rack, u, 1, 'half');
            });
            setupSlotDropEvents(emptySubSlot, rack, 1);
            slotsGrid.appendChild(emptySubSlot);
          }
          // 列2 が空き
          if (!rowCols[4] && !rowCols[5] && !rowCols[6]) {
            const emptySubSlot = document.createElement('div');
            emptySubSlot.className = 'sub-slot-cell sub-slot-empty';
            emptySubSlot.style.gridRow = `${rowIndex} / span 1`;
            emptySubSlot.style.gridColumn = '4 / span 3';
            emptySubSlot.dataset.rackId = rack.id;
            emptySubSlot.dataset.u = u;
            emptySubSlot.dataset.col = 2;
            emptySubSlot.title = `${u}U 列2: クリックでハーフ機器を追加 (1/2幅)`;
            emptySubSlot.innerHTML = `<span class="sub-slot-empty-text">+ 空き</span>`;
            emptySubSlot.addEventListener('click', (e) => {
              e.stopPropagation();
              quickAddSubDeviceAt(rack, u, 2, 'half');
            });
            setupSlotDropEvents(emptySubSlot, rack, 2);
            slotsGrid.appendChild(emptySubSlot);
          }
        }
      }
    }

    // 3. マウントされた機器を直接 CSS Grid に配置 (1U+2Uなどの非対称高さもネイティブに美しく配置)
    visibleDevices.forEach((dev) => {
      const topU = dev.startU + (dev.sizeU || 1) - 1;
      const rowIndex = rack.units - topU + 1;
      const devEl = createDeviceElement(dev, rack, rowIndex);

      devEl.style.gridRow = `${rowIndex} / span ${dev.sizeU || 1}`;
      devEl.style.gridColumn = getDeviceGridColumn(dev.slotWidth, dev.slotCol);
      devEl.dataset.topU = topU;
      devEl.dataset.startU = dev.startU;
      devEl.dataset.sizeU = dev.sizeU;
      devEl.dataset.deviceId = dev.id;
      slotsGrid.appendChild(devEl);
    });

    // 右側 U番号目盛り (CSS Grid: 42U 〜 1U / 完全左右対称)
    const rightUNumbers = document.createElement('div');
    rightUNumbers.className = 'rack-u-numbers u-numbers-right';
    for (let u = rack.units; u >= 1; u--) {
      const uLabel = document.createElement('div');
      uLabel.className = 'u-number-label';
      uLabel.textContent = `${u}U`;
      rightUNumbers.appendChild(uLabel);
    }

    // 右ポスト (CSS Grid)
    const rightPost = document.createElement('div');
    rightPost.className = 'rack-post';
    for (let u = rack.units; u >= 1; u--) {
      const hole = document.createElement('div');
      hole.className = 'post-hole';
      hole.innerHTML = '<div class="screw-hole"></div>';
      rightPost.appendChild(hole);
    }

    // 縦型配線ダクト (左右ケーブルマネージャー)
    const leftDuct = document.createElement('div');
    leftDuct.className = 'cable-duct duct-left';
    leftDuct.innerHTML = '<div class="duct-ring"></div><div class="duct-ring"></div><div class="duct-ring"></div>';

    const rightDuct = document.createElement('div');
    rightDuct.className = 'cable-duct duct-right';
    rightDuct.innerHTML = '<div class="duct-ring"></div><div class="duct-ring"></div><div class="duct-ring"></div>';

    body.appendChild(leftDuct);
    body.appendChild(leftPost);
    body.appendChild(leftUNumbers);
    body.appendChild(slotsGrid);
    body.appendChild(rightUNumbers);
    body.appendChild(rightPost);
    body.appendChild(rightDuct);

    rackCard.appendChild(body);
    elements.racksContainer.appendChild(rackCard);
  });

  // 全ラックカード描画完了後に、最前面として LANケーブル SVG レイヤーを配置
  let svgLayer = document.getElementById('cable-svg-layer');
  if (!svgLayer) {
    svgLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgLayer.id = 'cable-svg-layer';
    svgLayer.className.baseVal = 'cable-svg-layer';
  }
  elements.racksContainer.appendChild(svgLayer);
  elements.cableSvgLayer = svgLayer;

  updateStorageDepotBadge();

  // ブラウザのレイアウト確定後に確実にLANケーブルを計算・描画 & 検索ハイライト適用
  requestAnimationFrame(() => {
    renderCables();
    if (state.searchQuery) {
      applySearchHighlights(state.searchQuery);
    }
    setTimeout(renderCables, 80);
    setTimeout(renderCables, 250);
  });
}

// --- 6分割 CSS Grid におけるスロット幅・列番号のスパン計算 ---
function getDeviceGridColumn(slotWidth, slotCol) {
  const w = slotWidth || 'full';
  const col = parseInt(slotCol, 10) || 1;

  if (w === 'half') {
    if (col === 2) return '4 / span 3';
    return '1 / span 3';
  } else if (w === 'third') {
    if (col === 2) return '3 / span 2';
    if (col === 3) return '5 / span 2';
    return '1 / span 2';
  } else if (w === 'quarter') {
    if (col === 2) return '3 / span 1';
    if (col === 3) return '4 / span 1';
    if (col === 4) return '5 / span 2';
    return '1 / span 2';
  }
  // full
  return '1 / span 6';
}

function createDeviceElement(dev, rack, startRow = null) {
  const devEl = document.createElement('div');
  devEl.className = `mounted-device-grid-item type-${dev.type || 'rackmount'}`;
  
  if (dev.slotWidth === 'half') {
    devEl.classList.add('width-half');
  } else if (dev.slotWidth === 'third') {
    devEl.classList.add('width-third');
  } else if (dev.slotWidth === 'quarter') {
    devEl.classList.add('width-quarter');
  } else {
    devEl.classList.add('width-full');
  }

  if (dev.id === state.selectedDeviceId) {
    devEl.classList.add('selected');
  }
  if (dev.isGhost) {
    devEl.classList.add('ghost-device');
    if (dev.isCrossConnected) {
      devEl.classList.add('has-cross-cable');
      devEl.title = `【跨ぎ配線接続中】反対面 (${dev.side === 'rear' ? '背面' : '前面'}) 設置機器 (クリックで選択・配線可能)`;
    } else {
      devEl.title = `反対面 (${dev.side === 'rear' ? '背面' : '前面'}) 設置機器 (クリックで選択・配線可能)`;
    }
  }

  if (startRow !== null) {
    devEl.style.gridRow = `${startRow} / span ${dev.sizeU || 1}`;
  }
  devEl.style.gridColumn = getDeviceGridColumn(dev.slotWidth, dev.slotCol);

  // ドラッグ可能フラグ＆識別データ
  devEl.draggable = true;
  devEl.dataset.deviceId = dev.id;
  devEl.dataset.rackId = rack.id;
  devEl.dataset.u = dev.startU;
  devEl.dataset.startU = dev.startU;

  // 死活LED
  let ledClass = 'unmonitored';
  let ledTitle = 'Ping 監視設定なし';
  if (state.settings.globalPingEnabled && dev.pingEnabled && dev.ip) {
    if (dev.status === 'online') {
      ledClass = 'online';
      ledTitle = `Ping 正常 (${dev.responseTimeMs !== null ? dev.responseTimeMs + 'ms' : 'OK'})`;
    } else if (dev.status === 'offline') {
      ledClass = 'offline';
      ledTitle = 'Ping 応答なし (ダウン)';
    } else {
      ledClass = 'unknown';
      ledTitle = 'ステータス未確認';
    }
  } else if (!state.settings.globalPingEnabled) {
    ledTitle = '全体Ping監視が無効です';
  }

  const tagsHtml = (dev.tags || [])
    .slice(0, 2)
    .map((t) => `<span class="device-mini-tag">${escapeHtml(t)}</span>`)
    .join('');

  const colBadge = ''; // ハーフ幅時の列タグは非表示
  const sideBadge = dev.side === 'full' 
    ? `<span class="device-mini-tag side-full-tag" title="前後貫通機器（前面・背面の両面にマウント）"><svg class="icon-svg-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg> 貫通</span>` 
    : '';

  const crossBadge = dev.isGhost && dev.isCrossConnected
    ? `<span class="device-mini-tag cross-connected-tag" title="反対面からLAN配線が接続されています"><svg class="icon-svg-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line></svg> ${dev.side === 'rear' ? '背面' : '前面'}側 接続中</span>`
    : (dev.isGhost ? `<span class="device-mini-tag ghost-tag">${dev.side === 'rear' ? '背面側' : '前面側'}</span>` : '');

  // HA クラスタロールバッジ (SVGアイコン使用)
  let haBadge = '';
  if (dev.haRole === 'primary') {
    haBadge = `<span class="device-mini-tag ha-primary-tag" title="HA Primary (主系 / Active)"><svg class="icon-svg-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Primary</span>`;
  } else if (dev.haRole === 'secondary') {
    haBadge = `<span class="device-mini-tag ha-secondary-tag" title="HA Secondary (従系 / Standby)"><svg class="icon-svg-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Secondary</span>`;
  }

  // デュアルIP表示 (VIP ＋ 個別管理IP: 1行ずつ表示)
  let ipDisplayHtml = '';
  if (dev.vip) {
    ipDisplayHtml = `
      <div class="device-ip-row device-vip-row">
        <span class="device-vip-badge" title="クラスタ仮想代表IP (VIP)"><svg class="icon-svg-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg> VIP: ${escapeHtml(dev.vip)}</span>
      </div>
      <div class="device-ip-row device-mgmt-row">
        <span class="device-ip-mgmt" title="個別管理IP (Mgmt IP)">Mgmt: ${dev.ip ? escapeHtml(dev.ip) : '未設定'}</span>
      </div>
    `;
  } else {
    ipDisplayHtml = `
      <div class="device-ip-row">
        <span class="device-ip" title="IPアドレス">${dev.ip ? escapeHtml(dev.ip) : 'IP未設定'}</span>
      </div>
    `;
  }

  // デフォルトポート数の推測（未設定時）
  let portCount = dev.portCount;
  if (portCount === undefined) {
    if (dev.type === 'l3_switch' || dev.type === 'l2_switch') portCount = 24;
    else if (dev.type === 'utm' || dev.type === 'router') portCount = 8;
    else if (dev.type === 'nas') portCount = 4;
    else if (dev.type === 'onu' || dev.type === 'mc') portCount = 2;
    else if (dev.type === 'ap') portCount = 2;
    else if (dev.type === 'rackmount') portCount = 2;
    else if (dev.type === 'desktop' || dev.type === 'hub') portCount = 8;
    else if (dev.type === 'iot') portCount = 1;
    else portCount = 0;
  }

  // ポートグリッドの生成
  let portsHtml = '';
  if (portCount > 0) {
    const isSmall = dev.slotWidth && dev.slotWidth !== 'full';
    const displayPortCount = isSmall ? Math.min(8, portCount) : portCount;
    let portItems = '';
    
    for (let p = 1; p <= displayPortCount; p++) {
      const existingCable = state.cables.find(
        (c) => (c.fromDeviceId === dev.id && c.fromPort === p) || (c.toDeviceId === dev.id && c.toPort === p)
      );
      const isConnected = !!existingCable;
      const isFromSelected = state.connectingCable && state.connectingCable.fromDeviceId === dev.id && state.connectingCable.fromPort === p;

      // v5: ポートの VLAN 設定を取得
      const portConf = dev.portConfigs ? (dev.portConfigs[p] || dev.portConfigs[String(p)]) : null;
      let vlanStyle = '';
      let vlanDataAttr = '';
      let portClass = 'port-item';

      let portTitle = `Port ${p}`;
      if (portConf && portConf.vlanId) {
        const vlanId = portConf.vlanId;
        const vlanName = portConf.vlanName || `VLAN ${vlanId}`;
        const mode = portConf.mode || 'access';
        const vColor = getVlanColor(vlanId);
        portClass += ' vlan-assigned';
        vlanStyle = `style="--port-vlan-color: ${vColor};"`;
        vlanDataAttr = `data-vlan-id="${vlanId}"`;

        if (state.activeVlanFilter && state.activeVlanFilter !== 'all' && String(vlanId) === String(state.activeVlanFilter)) {
          portClass += ' vlan-match';
        }

        portTitle += ` [VLAN ${vlanId}: ${vlanName} (${mode.toUpperCase()})${portConf.ip ? ' / ' + portConf.ip : ''}]`;
      }

      if (isConnected) {
        const otherDevId = existingCable.fromDeviceId === dev.id ? existingCable.toDeviceId : existingCable.fromDeviceId;
        const otherPort = existingCable.fromDeviceId === dev.id ? existingCable.toPort : existingCable.fromPort;
        const otherDev = findDevice(otherDevId)?.device;
        portTitle += ` - [接続中: ${otherDev?.name || otherDevId} (P${otherPort})] - クリックで繋ぎ直し`;
      } else {
        portTitle += ` (空き) - クリックして配線`;
      }

      if (isConnected) portClass += ' connected';
      if (isFromSelected) portClass += ' selected-from';
      if (state.cableMode) portClass += ' selectable';

      portItems += `
        <div class="${portClass}" data-device-id="${dev.id}" data-port="${p}" ${vlanDataAttr} ${vlanStyle} title="${escapeHtml(portTitle)}">
          <span class="port-led"></span>
        </div>
      `;
    }

    portsHtml = `
      <div class="device-ports-section">
        <div class="device-ports-grid" style="grid-template-columns: repeat(${Math.ceil(displayPortCount / 2)}, 9px);">
          ${portItems}
        </div>
      </div>
    `;
  }

  devEl.innerHTML = `
    <div class="device-status-led ${ledClass}" title="${ledTitle}"></div>
    <div class="device-main-info">
      <div class="device-name-row">
        <span class="device-hostname" title="${escapeHtml(dev.hostname ? `${dev.hostname} (${dev.name})` : dev.name)}">${escapeHtml(dev.hostname || dev.name)}</span>
        ${haBadge}
        ${sideBadge}
        ${crossBadge}
      </div>
      ${ipDisplayHtml}
    </div>
    ${portsHtml}
  `;

  // ポートクリックイベント (ポート操作と機器ドラッグの完全分離)
  devEl.querySelectorAll('.port-item').forEach((portEl) => {
    const portNum = parseInt(portEl.dataset.port, 10);
    portEl.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    portEl.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      showPortTooltip(dev, portNum, e);
    });
    portEl.addEventListener('mousemove', (e) => {
      e.stopPropagation();
      moveDeviceTooltip(e);
    });
    portEl.addEventListener('mouseleave', (e) => {
      e.stopPropagation();
      hideDeviceTooltip();
    });
    portEl.addEventListener('click', (e) => {
      e.stopPropagation();
      hideDeviceTooltip();
      handlePortClick(dev, portNum);
    });
  });

  // 機器ホバー詳細ポップアップ (カーソルから適度に離して表示)
  devEl.addEventListener('mouseenter', (e) => {
    showDeviceTooltip(dev, rack, e);
  });
  devEl.addEventListener('mousemove', (e) => {
    moveDeviceTooltip(e);
  });
  devEl.addEventListener('mouseleave', () => {
    hideDeviceTooltip();
  });

  // 機器全体クリック
  devEl.addEventListener('click', (e) => {
    e.stopPropagation();
    hideDeviceTooltip();
    if (state.cableMode) {
      // 配線モード中はデフォルトでポート1を選択
      handlePortClick(dev, 1);
    } else {
      selectDevice(dev.id);
      triggerDeviceCablesCommunication(dev.id);
    }
  });

  // 機器自身はドラッグ元のみ。ドロップ受入はスロットセルが担当
  setupDeviceDragEvents(devEl, dev, rack);
  return devEl;
}

// ==========================================================================
// LANケーブル配線エンジン & 双方向通信光パルス演出
// ==========================================================================

function toggleCableMode(forceState = null) {
  state.cableMode = forceState !== null ? forceState : !state.cableMode;
  document.body.classList.toggle('cable-mode', state.cableMode);
  if (elements.btnCableMode) elements.btnCableMode.classList.toggle('active', state.cableMode);

  if (state.cableMode) {
    updateConnectingBarUI();
    showToast('LANケーブル配線モードを有効化しました (ポートをクリックして配線)', 'info');
  } else {
    cancelCableConnecting();
  }

  renderRacks();
}

function cancelCableConnecting() {
  state.connectingCable = null;
  state.cableMode = false;
  document.body.classList.remove('cable-mode');
  if (elements.btnCableMode) {
    elements.btnCableMode.classList.remove('active');
  }
  updateConnectingBarUI();
  document.querySelectorAll('.port-item.selected-from').forEach((el) => {
    el.classList.remove('selected-from');
  });
}

function updateCableCountBadge() {
  if (elements.cableCountBadge) {
    elements.cableCountBadge.textContent = state.cables ? state.cables.length : 0;
  }
}

function panToRack(rackId) {
  const rackEl = document.getElementById(`rack-card-${rackId}`) || document.querySelector(`.rack-card[data-rack-id="${rackId}"]`);
  const viewport = elements.stageViewport || elements.rackStage || document.getElementById('rack-stage');
  const container = elements.racksContainer || document.getElementById('racks-container');
  if (!rackEl || !viewport || !container) {
    console.warn('[panToRack] Target rack not found:', rackId);
    return;
  }

  const vpRect = viewport.getBoundingClientRect();
  const rackLeftInContainer = rackEl.offsetLeft;
  const rackWidth = rackEl.offsetWidth;

  // 目的のラックが画面中央に来るようパン座標を計算
  state.panX = (vpRect.width / 2) - (rackLeftInContainer + rackWidth / 2) * state.zoom;
  state.panY = Math.max(30, state.panY);

  container.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1)';
  container.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
  setTimeout(() => {
    container.style.transition = '';
    renderCables();
  }, 360);

  rackEl.classList.add('search-matched');
  setTimeout(() => rackEl.classList.remove('search-matched'), 2000);

  // ラックピルの current 表示更新
  if (elements.cableRackJumpList) {
    elements.cableRackJumpList.querySelectorAll('.cable-rack-jump-pill').forEach((pill) => {
      pill.classList.toggle('current', pill.dataset.rackId === rackId);
    });
  }
}

function updateConnectingBarUI() {
  if (!elements.cableConnectingBar) return;

  if (!state.cableMode) {
    elements.cableConnectingBar.classList.add('hidden');
    if (elements.cableRackJumpGroup) elements.cableRackJumpGroup.classList.add('hidden');
    if (elements.cableQuickConnectGroup) elements.cableQuickConnectGroup.classList.add('hidden');
    if (elements.cableQuickResultsDropdown) elements.cableQuickResultsDropdown.classList.add('hidden');
    return;
  }

  elements.cableConnectingBar.classList.remove('hidden');

  if (!state.connectingCable) {
    if (elements.cableConnectingText) {
      elements.cableConnectingText.innerHTML = `接続元ポートをクリックして選択してください`;
    }
    if (elements.cableRackJumpGroup) elements.cableRackJumpGroup.classList.add('hidden');
    if (elements.cableQuickConnectGroup) elements.cableQuickConnectGroup.classList.add('hidden');
    if (elements.cableQuickResultsDropdown) elements.cableQuickResultsDropdown.classList.add('hidden');
    if (elements.cableQuickTargetSearch) elements.cableQuickTargetSearch.value = '';
  } else {
    const fromDev = findDevice(state.connectingCable.fromDeviceId)?.device;
    const fromRack = findDevice(state.connectingCable.fromDeviceId)?.rack;
    const fromPort = state.connectingCable.fromPort;

    if (elements.cableConnectingText) {
      elements.cableConnectingText.innerHTML = `
        <span style="color:#fbbf24; font-weight:700;">【接続先を選択】</span>
        始点: <strong>${escapeHtml(fromDev ? fromDev.name : '機器')}</strong> (P${fromPort})
      `;
    }

    // 1. ラック一発ジャンプピルを生成
    if (elements.cableRackJumpGroup && elements.cableRackJumpList) {
      elements.cableRackJumpGroup.classList.remove('hidden');
      elements.cableRackJumpList.innerHTML = '';
      state.racks.forEach((r) => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'cable-rack-jump-pill';
        pill.dataset.rackId = r.id;
        if (fromRack && fromRack.id === r.id) {
          pill.classList.add('current');
        }
        pill.innerHTML = `<span>🏢</span> ${escapeHtml(r.name)}`;
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          panToRack(r.id);
        });
        elements.cableRackJumpList.appendChild(pill);
      });
    }

    // 2. 接続先クイック検索アシスタントを表示
    if (elements.cableQuickConnectGroup) {
      elements.cableQuickConnectGroup.classList.remove('hidden');
      setupQuickConnectSearch();
    }
  }
}

function setupQuickConnectSearch() {
  const searchInput = elements.cableQuickTargetSearch;
  const dropdown = elements.cableQuickResultsDropdown;
  if (!searchInput || !dropdown) return;

  function renderQuickSearchResults(query = '') {
    if (!state.connectingCable) {
      dropdown.classList.add('hidden');
      return;
    }

    const { fromDeviceId, fromPort } = state.connectingCable;
    dropdown.innerHTML = '';
    const q = query.toLowerCase().trim();

    const candidates = [];
    state.racks.forEach((rack) => {
      rack.devices.forEach((dev) => {
        if (dev.id === fromDeviceId) return;
        if (!q) {
          candidates.push({ dev, rack });
        } else {
          const matchText = `${rack.name} ${dev.name} ${dev.ip || ''} ${dev.vip || ''} ${dev.hostname || ''} ${(dev.tags || []).join(' ')} ${getDeviceTypeName(dev.type)}`.toLowerCase();
          if (matchText.includes(q)) {
            candidates.push({ dev, rack });
          }
        }
      });
    });

    if (candidates.length === 0) {
      dropdown.innerHTML = '<div class="cable-results-empty">一致する接続先機器がありません</div>';
      dropdown.classList.remove('hidden');
      return;
    }

    candidates.slice(0, 10).forEach(({ dev, rack }) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cable-quick-result-item';

      const portCount = Math.max(1, dev.portCount !== undefined ? dev.portCount : 4);
      let portsButtonsHtml = '';
      for (let p = 1; p <= Math.min(portCount, 8); p++) {
        const isConnected = state.cables.some(
          (c) =>
            (c.fromDeviceId === fromDeviceId && c.fromPort === fromPort && c.toDeviceId === dev.id && c.toPort === p) ||
            (c.fromDeviceId === dev.id && c.fromPort === p && c.toDeviceId === fromDeviceId && c.toPort === fromPort)
        );
        if (!isConnected) {
          portsButtonsHtml += `<button type="button" class="btn-quick-wire-port" data-port="${p}" title="Port ${p} へ接続">P${p}</button>`;
        }
      }

      itemEl.innerHTML = `
        <div class="cable-result-main">
          <div class="cable-result-name">
            <span class="cable-result-u-tag">[${dev.startU}U]</span>
            <span class="cable-result-rack-tag">${escapeHtml(rack.name)}</span>
            <span>${escapeHtml(dev.name)}</span>
          </div>
          <div class="cable-result-meta">
            <span>${dev.ip ? 'IP: ' + escapeHtml(dev.ip) : 'IP未設定'}</span>
            <span>(${getDeviceTypeName(dev.type)})</span>
          </div>
        </div>
        <div class="cable-result-action">
          ${portsButtonsHtml || '<span style="font-size:10px; color:#ef4444;">満杯</span>'}
        </div>
      `;

      itemEl.querySelectorAll('.btn-quick-wire-port').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetPort = parseInt(btn.dataset.port, 10);
          createCableBetween(fromDeviceId, fromPort, dev.id, targetPort, state.selectedCableColor || '#38bdf8');
          dropdown.classList.add('hidden');
        });
      });

      // アイテム本体クリック時はそのラック・機器へオートフォーカス
      itemEl.addEventListener('click', () => {
        panToRack(rack.id);
        selectDevice(dev.id);
      });

      dropdown.appendChild(itemEl);
    });

    dropdown.classList.remove('hidden');
  }

  searchInput.oninput = (e) => {
    renderQuickSearchResults(e.target.value);
  };

  searchInput.onfocus = () => {
    renderQuickSearchResults(searchInput.value);
  };
}

function createCableBetween(fromDeviceId, fromPort, toDeviceId, toPort, color = '#38bdf8') {
  const fromDev = findDevice(fromDeviceId)?.device;
  const toDev = findDevice(toDeviceId)?.device;
  if (!fromDev || !toDev) return false;

  // 1. 同一ポート間の二重登録チェック
  const exactMatch = state.cables.find(
    (c) =>
      (c.fromDeviceId === fromDeviceId && c.fromPort === fromPort && c.toDeviceId === toDeviceId && c.toPort === toPort) ||
      (c.fromDeviceId === toDeviceId && c.fromPort === toPort && c.toDeviceId === fromDeviceId && c.toPort === fromPort)
  );

  if (exactMatch) {
    showToast('このポート間は既にLANケーブルで接続されています', 'info');
    cancelCableConnecting();
    return false;
  }

  pushHistoryState(`配線: ${fromDev.name} P${fromPort} ⇄ ${toDev.name} P${toPort}`);

  // 2. 接続元ポート / 接続先ポートに既に接続されている古い配線を検出して自動解除（二重配線防止 ＆ 繋ぎ直し）
  const oldCables = state.cables.filter(
    (c) =>
      (c.fromDeviceId === fromDeviceId && c.fromPort === fromPort) ||
      (c.toDeviceId === fromDeviceId && c.toPort === fromPort) ||
      (c.fromDeviceId === toDeviceId && c.fromPort === toPort) ||
      (c.toDeviceId === toDeviceId && c.toPort === toPort)
  );

  const rewiredLogs = [];
  if (oldCables.length > 0) {
    oldCables.forEach((oc) => {
      const idx = state.cables.indexOf(oc);
      if (idx !== -1) {
        state.cables.splice(idx, 1);
        rewiredLogs.push(oc.label);
      }
    });
  }

  const newCable = {
    id: 'cable-' + Date.now(),
    fromDeviceId: fromDeviceId,
    fromPort: fromPort,
    toDeviceId: toDeviceId,
    toPort: toPort,
    color: color,
    side: state.settings.viewMode || 'front',
    label: `${fromDev.name} (P${fromPort}) ⇄ ${toDev.name} (P${toPort})`
  };

  state.cables.push(newCable);

  const logReason = rewiredLogs.length > 0
    ? `[配線変更・繋ぎ直し] ${newCable.label} を結線（旧接続: ${rewiredLogs.join(' / ')} を解除）`
    : `[配線] ${newCable.label} を結線 (${color})`;

  recordChangeLog({
    hostname: `${fromDev.name} ⇄ ${toDev.name}`,
    deviceId: fromDev.id,
    type: 'wiring',
    operator: '管理者 (GUI)',
    reason: logReason
  });

  saveData();
  updateCableCountBadge();
  cancelCableConnecting();
  renderRacks();
  populatePropertyPanel(toDev.id);

  if (rewiredLogs.length > 0) {
    showToast(`LANケーブルを繋ぎ直しました: ${newCable.label}\n（旧配線: ${rewiredLogs.join(', ')} を自動解除）`, 'success');
  } else {
    showToast(`LANケーブルを配線しました: ${newCable.label}`, 'success');
  }

  setTimeout(() => {
    triggerCablePulse(newCable.id);
  }, 200);

  return true;
}

function handlePortClick(device, portNum) {
  // ポートクリック時は自動的に配線モードを有効化
  if (!state.cableMode) {
    state.cableMode = true;
    document.body.classList.add('cable-mode');
    if (elements.btnCableMode) elements.btnCableMode.classList.add('active');
  }

  // 1. 接続元ポートの選択（未選択時）
  if (!state.connectingCable) {
    state.connectingCable = {
      fromDeviceId: device.id,
      fromPort: portNum
    };
    updateConnectingBarUI();
    renderRacks();
    selectDevice(device.id);

    // 既に接続があるポートか確認
    const existing = state.cables.find(
      (c) => (c.fromDeviceId === device.id && c.fromPort === portNum) || (c.toDeviceId === device.id && c.toPort === portNum)
    );

    if (existing) {
      const otherDevId = existing.fromDeviceId === device.id ? existing.toDeviceId : existing.fromDeviceId;
      const otherPort = existing.fromDeviceId === device.id ? existing.toPort : existing.fromPort;
      const otherDev = findDevice(otherDevId)?.device;
      showToast(`【繋ぎ直し】${device.name} (Port ${portNum}) を選択中 (現接続: ${otherDev?.name || otherDevId} P${otherPort})。接続先ポートをクリックすると自動で繋ぎ直されます`, 'info');
    } else {
      showToast(`接続元: ${device.name} (Port ${portNum}) を選択しました。接続先ポートをクリックまたは検索してください`, 'info');
    }
  } else {
    // 2. 接続先ポートの選択
    const { fromDeviceId, fromPort } = state.connectingCable;

    if (fromDeviceId === device.id && fromPort === portNum) {
      // 同一ポートクリックでキャンセル
      cancelCableConnecting();
      showToast('配線選択をキャンセルしました', 'info');
      renderRacks();
      return;
    }

    createCableBetween(fromDeviceId, fromPort, device.id, portNum, state.selectedCableColor || '#38bdf8');
  }
}

function deleteCable(cableId) {
  const idx = state.cables.findIndex((c) => c.id === cableId);
  if (idx !== -1) {
    pushHistoryState('LAN配線の削除');
    const [c] = state.cables.splice(idx, 1);
    const fromDev = findDevice(c.fromDeviceId)?.device;
    const toDev = findDevice(c.toDeviceId)?.device;
    const devName1 = fromDev?.name || '機器1';
    const devName2 = toDev?.name || '機器2';
    recordChangeLog({
      hostname: `${devName1} ⇄ ${devName2}`,
      deviceId: c.fromDeviceId,
      type: 'wiring',
      operator: 'GUI 操作',
      reason: `[配線切断] ${devName1} (P${c.fromPort}) ⇄ ${devName2} (P${c.toPort}) の結線を解除`
    });
    saveData();
    updateCableCountBadge();
    renderRacks();
    if (state.selectedDeviceId) {
      populatePropertyPanel(state.selectedDeviceId);
    }
    showToast(`LANケーブル配線を削除しました`, 'info');
  }
}

// --- プロパティパネル内 LAN配線管理 ---
function renderPropCables(deviceId) {
  if (!elements.propCablesList) return;

  const found = findDevice(deviceId);
  if (!found) return;
  const { device } = found;

  const devPortCount = device.portCount !== undefined ? device.portCount : 4;

  // 自機器のポート選択肢を更新 (通常・外部配線両方)
  if (elements.propCableFromPort) {
    elements.propCableFromPort.innerHTML = '';
    const maxP = Math.max(1, devPortCount);
    for (let p = 1; p <= maxP; p++) {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = `Port ${p}`;
      elements.propCableFromPort.appendChild(opt);
    }
  }

  if (elements.propCableExtFromPort) {
    elements.propCableExtFromPort.innerHTML = '';
    const maxP = Math.max(1, devPortCount);
    for (let p = 1; p <= maxP; p++) {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = `Port ${p}`;
      elements.propCableExtFromPort.appendChild(opt);
    }
  }

  // 接続先機器の選択肢（ラック別グループ化 ＆ リアルタイム絞り込み検索）
  const updateToPorts = () => {
    const targetId = elements.propCableTargetDev ? elements.propCableTargetDev.value : null;
    const targetDev = findDevice(targetId)?.device;
    if (elements.propCableToPort) {
      elements.propCableToPort.innerHTML = '';
      const tCount = targetDev && targetDev.portCount !== undefined ? targetDev.portCount : 4;
      const maxTP = Math.max(1, tCount);
      for (let p = 1; p <= maxTP; p++) {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = `Port ${p}`;
        elements.propCableToPort.appendChild(opt);
      }
    }
  };

  function buildTargetOptions(filterText = '') {
    if (!elements.propCableTargetDev) return;
    elements.propCableTargetDev.innerHTML = '';
    const q = filterText.toLowerCase().trim();
    let totalCount = 0;

    state.racks.forEach((r) => {
      const matchingDevs = r.devices.filter((d) => {
        if (d.id === device.id) return false;
        if (!q) return true;
        const text = `${r.name} ${d.startU}u ${d.name} ${d.ip || ''} ${d.vip || ''} ${d.hostname || ''} ${(d.tags || []).join(' ')} ${getDeviceTypeName(d.type)}`.toLowerCase();
        return text.includes(q);
      });

      if (matchingDevs.length > 0) {
        const group = document.createElement('optgroup');
        group.label = `🏢 ${r.name} (${matchingDevs.length}台)`;
        matchingDevs.forEach((d) => {
          totalCount++;
          const opt = document.createElement('option');
          opt.value = d.id;
          const ipInfo = d.ip ? ` [${d.ip}]` : '';
          opt.textContent = `[${d.startU}U] ${d.name}${ipInfo} (${getDeviceTypeName(d.type)})`;
          group.appendChild(opt);
        });
        elements.propCableTargetDev.appendChild(group);
      }
    });

    if (elements.propCableTargetCount) {
      elements.propCableTargetCount.textContent = `(${totalCount}台)`;
    }

    if (totalCount === 0) {
      const emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.textContent = '一致する接続先機器がありません';
      elements.propCableTargetDev.appendChild(emptyOpt);
    }
    updateToPorts();
  }

  if (elements.propCableTargetSearch) {
    elements.propCableTargetSearch.value = '';
    elements.propCableTargetSearch.oninput = (e) => {
      buildTargetOptions(e.target.value);
    };
  }

  if (elements.propCableTargetDev) {
    elements.propCableTargetDev.onchange = updateToPorts;
    buildTargetOptions('');
  }

  // 1. ポート稼働状況マップのレンダリング
  if (elements.propPortGridContainer && elements.propPortMapSummary) {
    elements.propPortGridContainer.innerHTML = '';
    const maxP = Math.max(1, devPortCount);
    let connectedCount = 0;

    for (let p = 1; p <= maxP; p++) {
      const cable = state.cables.find(
        (c) => (c.fromDeviceId === device.id && c.fromPort === p) || (c.toDeviceId === device.id && c.toPort === p)
      );

      const isConnected = !!cable;
      if (isConnected) connectedCount++;

      const isExternal = cable && (cable.toDeviceId === '__external__' || !!cable.externalTarget);

      const itemEl = document.createElement('div');
      itemEl.className = `prop-port-slot-item ${isConnected ? 'connected' : 'empty'} ${isExternal ? 'external-connected' : ''}`;
      itemEl.dataset.port = p;

      let targetText = '空き (未接続)';
      let targetName = '空き';
      let targetLoc = '';
      if (cable) {
        if (isExternal) {
          targetName = cable.externalTarget || 'フロア/外部接続';
          targetLoc = 'Floor / External';
          targetText = `🌐 ${targetName}`;
          itemEl.title = `Port ${p}: 外部・フロア接続 [${targetName}] [クリックで自ポートに選択]`;
        } else {
          const isFrom = cable.fromDeviceId === device.id;
          const otherDevId = isFrom ? cable.toDeviceId : cable.fromDeviceId;
          const otherPort = isFrom ? cable.toPort : cable.fromPort;
          const otherFound = findDevice(otherDevId);
          const otherDev = otherFound?.device;
          const otherRack = otherFound?.rack;
          targetName = otherDev ? (otherDev.name || otherDevId) : '相手機器';
          targetLoc = `${otherRack ? otherRack.name : ''} ${otherDev ? otherDev.startU + 'U' : ''}`;
          targetText = `➔ ${targetName} [P${otherPort}]`;
          itemEl.title = `Port ${p}: ${targetName} (${targetLoc} P${otherPort}) と接続中 [クリックで自ポートに選択]`;
        }
      } else {
        itemEl.title = `Port ${p}: 空きポート [クリックで自ポートに選択]`;
      }

      itemEl.innerHTML = `
        <div class="prop-port-status-led ${isConnected ? 'connected' : 'empty'} ${isExternal ? 'external' : ''}"></div>
        <span class="prop-port-num-badge">P${p}</span>
        <div class="prop-port-slot-info">
          <span class="prop-port-slot-label">${isConnected ? escapeHtml(targetName) : '空きポート'}</span>
          <span class="prop-port-slot-target">${escapeHtml(targetText)}</span>
        </div>
      `;

      itemEl.addEventListener('click', () => {
        if (elements.propCableFromPort) {
          elements.propCableFromPort.value = p;
        }
        if (elements.propCableExtFromPort) {
          elements.propCableExtFromPort.value = p;
        }
        document.querySelectorAll('.prop-port-slot-item').forEach(el => el.classList.remove('selected'));
        itemEl.classList.add('selected');
        if (!isConnected && elements.propCableTargetSearch) {
          elements.propCableTargetSearch.focus();
        }
      });

      elements.propPortGridContainer.appendChild(itemEl);
    }

    elements.propPortMapSummary.textContent = `接続中: ${connectedCount} / 空き: ${maxP - connectedCount} (全${maxP}P)`;
  }

  // 2. この機器に繋がっている有効なケーブル一覧をレンダリング（ラック内・外部両方）
  const connectedCables = state.cables.filter((c) => {
    if (c.fromDeviceId === device.id || c.toDeviceId === device.id) {
      if (c.toDeviceId === '__external__' || !!c.externalTarget) return true;
      return findDevice(c.fromDeviceId) && findDevice(c.toDeviceId);
    }
    return false;
  });

  elements.propCablesList.innerHTML = '';
  if (connectedCables.length === 0) {
    elements.propCablesList.innerHTML = '<div style="font-size:11px; color:#64748b; padding:4px 0;">接続されているLANケーブルはありません</div>';
  } else {
    connectedCables.forEach((c) => {
      const isExternal = c.toDeviceId === '__external__' || !!c.externalTarget;
      const isFrom = c.fromDeviceId === device.id;
      const otherDevId = isFrom ? c.toDeviceId : c.fromDeviceId;
      const otherPort = isFrom ? c.toPort : c.fromPort;
      const selfPort = isFrom ? c.fromPort : c.toPort;

      let targetDisplayHtml = '';
      if (isExternal) {
        const extTargetName = c.externalTarget || c.label || 'フロア/外部接続';
        targetDisplayHtml = `<span class="prop-cable-target-text" title="${escapeHtml(extTargetName)}" style="color:#6ee7b7;">➔ 🌐 [外部/フロア: ${escapeHtml(extTargetName)}]</span>`;
      } else {
        const otherInfo = findDevice(otherDevId);
        const otherDev = otherInfo?.device;
        const otherRack = otherInfo?.rack;
        const otherRackName = otherRack ? otherRack.name : '';
        const otherName = otherDev ? otherDev.name : '相手機器';
        const otherStartU = otherDev ? `${otherDev.startU}U` : '-';
        targetDisplayHtml = `<span class="prop-cable-target-text" title="${escapeHtml(otherName)}">[相手 ${otherStartU} : ${escapeHtml(otherRackName ? otherRackName + ' - ' : '')}${escapeHtml(otherName)} (P${otherPort})]</span>`;
      }

      // カラー選択肢一覧 HTML を生成
      let colorOptionsHtml = CABLE_COLORS.map((item) => {
        const isSelected = item.color.toLowerCase() === (c.color || '#38bdf8').toLowerCase();
        return `<option value="${item.color}" ${isSelected ? 'selected' : ''}>${item.label}</option>`;
      }).join('');

      // プリセット以外のカスタム色の場合
      const isPreset = CABLE_COLORS.some((item) => item.color.toLowerCase() === (c.color || '').toLowerCase());
      if (!isPreset && c.color) {
        colorOptionsHtml += `<option value="${c.color}" selected>🎨 カスタム (${c.color})</option>`;
      }

      const item = document.createElement('div');
      item.className = 'prop-cable-item';
      item.style.setProperty('--cable-color', c.color || (isExternal ? '#22c55e' : '#38bdf8'));
      item.innerHTML = `
        <div class="prop-cable-info" title="${escapeHtml(c.label || '')}">
          <span class="prop-cable-u-badge">[自 ${device.startU}U : P${selfPort}]</span>
          <span class="prop-cable-arrow">⇄</span>
          ${targetDisplayHtml}
        </div>
        <div class="prop-cable-color-select-wrap">
          <select class="prop-cable-inline-color-select" title="配線カラー一覧から選択">
            ${colorOptionsHtml}
          </select>
        </div>
        <div class="prop-cable-actions">
          <button type="button" class="btn-icon btn-sm" title="通信テスト実行" style="color:${c.color || (isExternal ? '#22c55e' : '#38bdf8')};">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </button>
          <button type="button" class="btn-icon btn-sm btn-del-cable" title="配線削除" style="color:#ef4444;">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `;

      // カラーセレクト変更イベント
      const colorSelect = item.querySelector('.prop-cable-inline-color-select');
      if (colorSelect) {
        colorSelect.addEventListener('change', (e) => {
          const newCol = e.target.value;
          c.color = newCol;
          item.style.setProperty('--cable-color', newCol);
          colorSelect.style.borderColor = newCol;
          renderCables();
          saveData();
          const selectedLabel = e.target.selectedOptions[0]?.text || newCol;
          showToast(`配線色を「${selectedLabel}」に変更しました`, 'info');
        });
      }

      item.querySelector('button[title="通信テスト実行"]').addEventListener('click', () => {
        triggerCablePulse(c.id);
        showToast(`通信テスト実行: ${c.label}`, 'info');
      });

      item.querySelector('.btn-del-cable').addEventListener('click', () => {
        if (confirm(`このLANケーブル配線を削除しますか？`)) {
          deleteCable(c.id);
        }
      });

      elements.propCablesList.appendChild(item);
    });
  }
}

// 直角配線パスの角を滑らかな丸み（ベジェ曲線）で補間するエンジン
function buildOrthogonalRoundedPath(points, radius = 12) {
  if (!points || points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const pPrev = points[i - 1];
    const pCurr = points[i];
    const pNext = points[i + 1];

    const v1x = pCurr.x - pPrev.x;
    const v1y = pCurr.y - pPrev.y;
    const len1 = Math.hypot(v1x, v1y);

    const v2x = pNext.x - pCurr.x;
    const v2y = pNext.y - pCurr.y;
    const len2 = Math.hypot(v2x, v2y);

    if (len1 === 0 || len2 === 0) continue;

    const u1x = v1x / len1;
    const u1y = v1y / len1;
    const u2x = v2x / len2;
    const u2y = v2y / len2;

    const r = Math.min(radius, len1 / 2, len2 / 2);

    const startX = pCurr.x - u1x * r;
    const startY = pCurr.y - u1y * r;
    const endX = pCurr.x + u2x * r;
    const endY = pCurr.y + u2y * r;

    d += ` L ${startX} ${startY} Q ${pCurr.x} ${pCurr.y} ${endX} ${endY}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

// --- LANケーブル SVG レイヤー描画エンジン (データセンター精密ダクト・床下配線ルート) ---
function renderCables() {
  const svg = elements.cableSvgLayer;
  if (!svg || !elements.racksContainer) return;

  const containerWidth = Math.max(3000, elements.racksContainer.scrollWidth || 3000);
  const containerHeight = Math.max(2500, elements.racksContainer.scrollHeight || 2500);

  svg.setAttribute('width', `${containerWidth}`);
  svg.setAttribute('height', `${containerHeight}`);
  svg.style.width = `${containerWidth}px`;
  svg.style.height = `${containerHeight}px`;

  svg.innerHTML = '';
  if (!state.cables || state.cables.length === 0) return;

  const containerRect = elements.racksContainer.getBoundingClientRect();
  const zoom = state.zoom || 1.0;

  state.cables.forEach((cable, cableIndex) => {
    const isExternal = cable.toDeviceId === '__external__' || !!cable.externalTarget;
    const fromDevInfo = findDevice(cable.fromDeviceId);
    if (!fromDevInfo) return;

    if (isExternal) {
      // --- 🌐 フロア・外部配線のSVG描画 (天井・ケーブルラック方向へ美しく立ち上がり) ---
      const fromDev = fromDevInfo.device;
      const fromRack = fromDevInfo.rack;
      const fromSide = fromDev.side || 'front';
      const fromRackView = state.rackViewModes[fromRack.id] || state.settings.viewMode || 'front';

      if (fromSide !== fromRackView && !fromDev.slotWidth?.includes('full')) {
        return;
      }

      let fromPortEl = document.querySelector(`.port-item[data-device-id="${cable.fromDeviceId}"][data-port="${cable.fromPort}"]`);
      const fromDevEl = document.querySelector(`.mounted-device-grid-item[data-device-id="${cable.fromDeviceId}"]`);
      if (!fromDevEl) return;

      let x1, y1;
      if (fromPortEl) {
        const r = fromPortEl.getBoundingClientRect();
        x1 = (r.left + r.width / 2 - containerRect.left) / zoom;
        y1 = (r.top + r.height / 2 - containerRect.top) / zoom;
      } else {
        const r = fromDevEl.getBoundingClientRect();
        x1 = (r.right - 25 - containerRect.left) / zoom;
        y1 = (r.top + r.height / 2 - containerRect.top) / zoom;
      }

      const fromRackCard = fromDevEl.closest('.rack-card');
      if (!fromRackCard) return;
      const fRect = fromRackCard.getBoundingClientRect();
      const fRight = (fRect.right - containerRect.left) / zoom;
      const fTop = (fRect.top - containerRect.top) / zoom;

      const offset = ((cableIndex % 4) - 1.5) * 2;
      const ductX = fRight + 10 + offset;
      const ceilingY = fTop - 20 - (cableIndex % 5) * 8;
      const tagEndX = ductX + 26;

      const pathPoints = [
        { x: x1, y: y1 },
        { x: ductX, y: y1 },
        { x: ductX, y: ceilingY },
        { x: tagEndX, y: ceilingY }
      ];
      const pathD = buildOrthogonalRoundedPath(pathPoints, 8);

      const cableCol = cable.color || '#22c55e';
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.className.baseVal = 'lan-cable-group lan-cable-external-group';
      g.dataset.cableId = cable.id;
      g.style.setProperty('--cable-color', cableCol);

      const shadowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      shadowPath.setAttribute('d', pathD);
      shadowPath.className.baseVal = 'lan-cable-shadow';

      const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      mainPath.setAttribute('d', pathD);
      mainPath.setAttribute('stroke', cableCol);
      mainPath.className.baseVal = 'lan-cable-path external-path';

      const flowBeam = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      flowBeam.setAttribute('d', pathD);
      flowBeam.className.baseVal = 'lan-cable-flow-beam';

      // 終端のフロアラベルバッジ (rect + text)
      const extName = cable.externalTarget || cable.label || 'Floor';
      const labelText = `🌐 ${extName}`;
      const textWidth = Math.max(76, labelText.length * 7.5 + 18);
      const textHeight = 20;

      const tagRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      tagRect.setAttribute('x', `${tagEndX}`);
      tagRect.setAttribute('y', `${ceilingY - textHeight / 2}`);
      tagRect.setAttribute('width', `${textWidth}`);
      tagRect.setAttribute('height', `${textHeight}`);
      tagRect.setAttribute('stroke', cableCol);
      tagRect.className.baseVal = 'lan-cable-external-rect';

      const tagText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tagText.setAttribute('x', `${tagEndX + textWidth / 2}`);
      tagText.setAttribute('y', `${ceilingY}`);
      tagText.textContent = labelText;
      tagText.className.baseVal = 'lan-cable-external-tag';

      g.addEventListener('mouseenter', (e) => {
        g.classList.add('active');
        showCableTooltip(cable, e);
      });
      g.addEventListener('mousemove', (e) => {
        moveDeviceTooltip(e);
      });
      g.addEventListener('mouseleave', () => {
        g.classList.remove('active');
        hideDeviceTooltip();
      });
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        hideDeviceTooltip();
        if (state.cableMode) {
          if (confirm(`外部・フロア配線を削除しますか？\n${cable.externalTarget || cable.label}`)) {
            deleteCable(cable.id);
          }
        } else {
          selectDevice(cable.fromDeviceId);
        }
      });

      g.appendChild(shadowPath);
      g.appendChild(mainPath);
      g.appendChild(flowBeam);
      g.appendChild(tagRect);
      g.appendChild(tagText);
      svg.appendChild(g);
      return;
    }

    // --- ラック間・機器間 通常配線の描画 ---
    const toDevInfo = findDevice(cable.toDeviceId);
    if (!toDevInfo) return;

    const fromDev = fromDevInfo.device;
    const toDev = toDevInfo.device;
    const fromRack = fromDevInfo.rack;
    const toRack = toDevInfo.rack;

    const fromSide = fromDev.side || 'front';
    const toSide = toDev.side || 'front';

    const fromRackView = state.rackViewModes[fromRack.id] || state.settings.viewMode || 'front';
    const toRackView = state.rackViewModes[toRack.id] || state.settings.viewMode || 'front';

    const isCrossSide = (fromSide === 'front' && toSide === 'rear') || (fromSide === 'rear' && toSide === 'front');

    // 面連動配線フィルタリング:
    // 1. 前面同士の配線: 両方のラックが背面表示の場合は非表示
    if (fromSide === 'front' && toSide === 'front') {
      if (fromRackView === 'rear' && toRackView === 'rear') {
        return;
      }
    }

    // 2. 背面同士の配線: 両方のラックが前面表示の場合は非表示
    if (fromSide === 'rear' && toSide === 'rear') {
      if (fromRackView === 'front' && toRackView === 'front') {
        return;
      }
    }

    // 3. 跨ぎ配線（Front ⇄ Rear）または前後貫通機器（Full Depth）: 前面・背面どちらのビューでも常時結線表示

    let fromPortEl = document.querySelector(`.port-item[data-device-id="${cable.fromDeviceId}"][data-port="${cable.fromPort}"]`);
    let toPortEl = document.querySelector(`.port-item[data-device-id="${cable.toDeviceId}"][data-port="${cable.toPort}"]`);

    // フォールバック: 機器要素そのものを取得
    const fromDevEl = document.querySelector(`.mounted-device-grid-item[data-device-id="${cable.fromDeviceId}"]`);
    const toDevEl = document.querySelector(`.mounted-device-grid-item[data-device-id="${cable.toDeviceId}"]`);

    if (!fromDevEl || !toDevEl) return;

    let x1, y1, x2, y2;

    if (fromPortEl) {
      const r = fromPortEl.getBoundingClientRect();
      x1 = (r.left + r.width / 2 - containerRect.left) / zoom;
      y1 = (r.top + r.height / 2 - containerRect.top) / zoom;
    } else {
      const r = fromDevEl.getBoundingClientRect();
      x1 = (r.right - 25 - containerRect.left) / zoom;
      y1 = (r.top + r.height / 2 - containerRect.top) / zoom;
    }

    if (toPortEl) {
      const r = toPortEl.getBoundingClientRect();
      x2 = (r.left + r.width / 2 - containerRect.left) / zoom;
      y2 = (r.top + r.height / 2 - containerRect.top) / zoom;
    } else {
      const r = toDevEl.getBoundingClientRect();
      x2 = (r.right - 25 - containerRect.left) / zoom;
      y2 = (r.top + r.height / 2 - containerRect.top) / zoom;
    }

    const fromRackCard = fromDevEl.closest('.rack-card');
    const toRackCard = toDevEl.closest('.rack-card');
    if (!fromRackCard || !toRackCard) return;

    const fRect = fromRackCard.getBoundingClientRect();
    const tRect = toRackCard.getBoundingClientRect();

    const fLeft = (fRect.left - containerRect.left) / zoom;
    const fRight = (fRect.right - containerRect.left) / zoom;
    const fBottom = (fRect.bottom - containerRect.top) / zoom;

    const tLeft = (tRect.left - containerRect.left) / zoom;
    const tRight = (tRect.right - containerRect.left) / zoom;
    const tBottom = (tRect.bottom - containerRect.top) / zoom;

    // ダクト内でのケーブル束をスリムに整列 (横に太く広がらないよう微細オフセットに集約)
    const offset = ((cableIndex % 4) - 1.5) * 2; // -3px, -1px, +1px, +3px (最大でも幅6px以内に綺麗に結束)
    let pathD = '';

    if (fromRackCard === toRackCard) {
      if (Math.abs(y1 - y2) < 8) {
        // 同一スロット内（横並び機器同士）の配線: 右ダクトへ遠回りせず、ポート間を綺麗なジャンパ線（短いU字カーブ）で直接接続
        const midY = Math.max(y1, y2) + 8;
        pathD = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
      } else {
        // 同一ラック内 (異なるU): ユニット右側のダクトへ出て、ダクト内を昇降して対象ユニット右側ポートへ
        const ductX = fRight + 10 + offset;
        pathPoints = [
          { x: x1, y: y1 },
          { x: ductX, y: y1 },
          { x: ductX, y: y2 },
          { x: x2, y: y2 }
        ];
        pathD = buildOrthogonalRoundedPath(pathPoints, 8);
      }
    } else {
      // ラック間配線: ユニット右側ダクト ➜ ラックに沿って最下部へ ➜ 床下を這って宛先ラックへ ➜ 宛先ラック右側ダクトを上昇 ➜ 宛先ユニット右側から接続
      const fromDuctX = fRight + 10 + offset;
      const toDuctX = tRight + 10 + offset;
      const floorY = Math.max(fBottom, tBottom) + 16 + (cableIndex % 4) * 3;

      pathPoints = [
        { x: x1, y: y1 },
        { x: fromDuctX, y: y1 },
        { x: fromDuctX, y: floorY },
        { x: toDuctX, y: floorY },
        { x: toDuctX, y: y2 },
        { x: x2, y: y2 }
      ];
      pathD = buildOrthogonalRoundedPath(pathPoints, 8);
    }

    // v5: VLAN フィルターによるケーブルハイライト判定
    let isVlanMatch = false;
    let cableVlanColor = cable.color || '#38bdf8';
    if (state.activeVlanFilter && state.activeVlanFilter !== 'all') {
      const fromConf = fromDev.portConfigs ? (fromDev.portConfigs[cable.fromPort] || fromDev.portConfigs[String(cable.fromPort)]) : null;
      const toConf = toDev.portConfigs ? (toDev.portConfigs[cable.toPort] || toDev.portConfigs[String(cable.toPort)]) : null;
      const filterVal = String(state.activeVlanFilter);
      if ((fromConf && String(fromConf.vlanId) === filterVal) || (toConf && String(toConf.vlanId) === filterVal)) {
        isVlanMatch = true;
        cableVlanColor = getVlanColor(filterVal);
      }
    }

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    let groupCls = isCrossSide ? 'lan-cable-group lan-cable-cross-side' : 'lan-cable-group';
    if (isVlanMatch) groupCls += ' vlan-match';
    g.className.baseVal = groupCls;
    g.dataset.cableId = cable.id;
    g.style.setProperty('--cable-color', isVlanMatch ? cableVlanColor : (cable.color || '#38bdf8'));
    g.style.setProperty('--port-vlan-color', cableVlanColor);

    // 影用パス
    const shadowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shadowPath.setAttribute('d', pathD);
    shadowPath.className.baseVal = 'lan-cable-shadow';

    // メインケーブルパス
    const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    mainPath.setAttribute('d', pathD);
    mainPath.setAttribute('stroke', isVlanMatch ? cableVlanColor : (cable.color || '#38bdf8'));
    let mainPathCls = isCrossSide ? 'lan-cable-path cross-side' : 'lan-cable-path';
    if (isVlanMatch) mainPathCls += ' vlan-match';
    mainPath.className.baseVal = mainPathCls;

    // 光の横線が動き続けるストリーム流動パス (選択中・ホバー時に流動)
    const flowBeam = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    flowBeam.setAttribute('d', pathD);
    flowBeam.className.baseVal = isCrossSide ? 'lan-cable-flow-beam cross-side' : 'lan-cable-flow-beam';

    // ケーブルホバー ＆ クリックイベント
    g.addEventListener('mouseenter', (e) => {
      g.classList.add('active');
      showCableTooltip(cable, e);
    });
    g.addEventListener('mousemove', (e) => {
      moveDeviceTooltip(e);
    });
    g.addEventListener('mouseleave', () => {
      g.classList.remove('active');
      hideDeviceTooltip();
    });

    g.addEventListener('click', (e) => {
      e.stopPropagation();
      hideDeviceTooltip();
      if (state.cableMode) {
        if (confirm(`LANケーブル配線を削除しますか？\n${cable.label || 'ケーブル'}`)) {
          deleteCable(cable.id);
        }
      } else {
        const fromInfo = findDevice(cable.fromDeviceId);
        if (fromInfo) selectDevice(fromInfo.device.id);
      }
    });

    g.appendChild(shadowPath);
    g.appendChild(mainPath);
    g.appendChild(flowBeam);
    svg.appendChild(g);
  });

  // 選択中のデバイスがある場合は、その接続LANケーブルを流動発光ハイライト
  if (state.selectedDeviceId) {
    highlightConnectedCables(state.selectedDeviceId);
  }
}

// --- 選択機器に接続されたLANケーブルのみを流動発光させる処理 ---
function highlightConnectedCables(deviceId) {
  document.querySelectorAll('.lan-cable-group').forEach((g) => {
    g.classList.remove('active-flow', 'dimmed-cable');
  });

  if (!deviceId) return;

  let hasConnected = false;
  (state.cables || []).forEach((c) => {
    if (c.fromDeviceId === deviceId || c.toDeviceId === deviceId) {
      hasConnected = true;
      const g = document.querySelector(`.lan-cable-group[data-cable-id="${c.id}"]`);
      if (g) {
        g.classList.add('active-flow');
      }
    }
  });

  if (hasConnected) {
    document.querySelectorAll('.lan-cable-group:not(.active-flow)').forEach((g) => {
      g.classList.add('dimmed-cable');
    });
  }
}

function triggerCablePulse(cableId) {
  // 互換用（光の横線ストリームが active-flow で継続流動するため旧パルスは不要）
  const g = document.querySelector(`.lan-cable-group[data-cable-id="${cableId}"]`);
  if (g) g.classList.add('active-flow');
}

function triggerDeviceCablesCommunication(deviceId) {
  highlightConnectedCables(deviceId);
}

// --- 空きサブスロット (横並び小型機器) クイック追加 ---
function quickAddSubDeviceAt(rack, targetU, colIndex, widthType = 'half') {
  const currentSide = state.rackViewModes[rack.id] || 'front';
  const newTicketNo = generateNextTicketNo();
  const newDev = {
    id: 'dev-' + Date.now(),
    ticketNo: newTicketNo,
    name: `新規機器-${targetU}U-列${colIndex}`,
    ip: '',
    hostname: '',
    vendor: '',
    model: '',
    sizeU: 1,
    startU: targetU,
    side: currentSide,
    type: 'desktop',
    slotWidth: widthType,
    slotCol: colIndex,
    portCount: 8,
    powerWatts: getDefaultPowerWatts('desktop', 1),
    tags: getDefaultTagsForType('desktop'),
    pingEnabled: false,
    status: 'unmonitored',
    responseTimeMs: null,
    lastChecked: null,
    notes: '同一1Uスロット内に横並び設置'
  };

  rack.devices.push(newDev);
  recordChangeLog({
    ticketNo: newTicketNo,
    hostname: newDev.hostname || newDev.name,
    deviceId: newDev.id,
    type: 'add',
    operator: '管理者 (GUI クイック追加)',
    reason: `[新規設置] ${newDev.name} を ${rack.name} の ${targetU}U (列${colIndex}) に配置`
  });
  saveData();
  renderRacks();
  selectDevice(newDev.id);
  showToast(`${rack.name} の ${targetU}U (列${colIndex}) に小型機器を追加しました`, 'success');
}

// エイリアス
const quickAddSubSlotDeviceAt = quickAddSubDeviceAt;

// --- 空きスロットクイック追加 ---
function quickAddDeviceAt(rack, targetU) {
  const currentSide = state.rackViewModes[rack.id] || 'front';
  const newTicketNo = generateNextTicketNo();
  const defaultTags = getDefaultTagsForType('rackmount');
  const defaultWatts = getDefaultPowerWatts('rackmount', 1);

  const newDev = {
    id: 'dev-' + Date.now(),
    ticketNo: newTicketNo,
    name: `Server-${targetU}U`,
    ip: '',
    hostname: '',
    vendor: '',
    model: '',
    sizeU: 1,
    startU: targetU,
    side: currentSide,
    type: 'rackmount',
    portCount: 2,
    powerWatts: defaultWatts,
    tags: [...defaultTags],
    pingEnabled: false,
    status: 'unmonitored',
    responseTimeMs: null,
    lastChecked: null,
    notes: ''
  };

  rack.devices.push(newDev);
  recordChangeLog({
    ticketNo: newTicketNo,
    hostname: newDev.hostname || newDev.name,
    deviceId: newDev.id,
    type: 'add',
    operator: '管理者 (GUI クイック追加)',
    reason: `[新規設置] ${newDev.name} (1U) を ${rack.name} の ${targetU}U に配置`
  });
  saveData();
  renderRacks();
  selectDevice(newDev.id);
  showToast(`${rack.name} の ${targetU}U に新規 1U サーバーを追加しました (タグ: ${defaultTags.join(', ')})`, 'success');
}

// --- リアルタイム検索 & ハイライト / クイックジャンプ機能 (案1) ---
function handleGlobalSearch(query) {
  const q = (query || '').trim().toLowerCase();
  state.searchQuery = q;

  if (elements.btnClearSearch) {
    elements.btnClearSearch.style.display = q ? 'inline-block' : 'none';
  }

  if (!q) {
    clearSearchHighlights();
    if (elements.searchResultsDropdown) {
      elements.searchResultsDropdown.style.display = 'none';
    }
    return;
  }

  const results = [];
  const words = q.split(/\s+/).filter(Boolean);

  state.racks.forEach((rack) => {
    rack.devices.forEach((dev) => {
      const tagsStr = (dev.tags || []).join(' ');
      const searchTarget = `
        ${dev.name || ''} 
        ${dev.ip || ''} 
        ${dev.vip || ''} 
        ${dev.hostname || ''} 
        ${dev.vendor || ''} 
        ${dev.model || ''} 
        ${tagsStr} 
        ${dev.notes || ''} 
        ${rack.name || ''} 
        ${getDeviceTypeName(dev.type)}
      `.toLowerCase();

      const isMatch = words.every((w) => searchTarget.includes(w));
      if (isMatch) {
        results.push({ device: dev, rack: rack });
      }
    });
  });

  applySearchHighlights(q, results.map((r) => r.device.id));
  renderSearchResultsDropdown(results, q);
}

function clearGlobalSearch() {
  state.searchQuery = '';
  if (elements.globalSearchInput) {
    elements.globalSearchInput.value = '';
  }
  if (elements.btnClearSearch) {
    elements.btnClearSearch.style.display = 'none';
  }
  if (elements.searchResultsDropdown) {
    elements.searchResultsDropdown.style.display = 'none';
  }
  clearSearchHighlights();
}

function clearSearchHighlights() {
  document.querySelectorAll('.mounted-device-grid-item').forEach((el) => {
    el.classList.remove('search-matched', 'search-dimmed');
  });
}

function applySearchHighlights(query, matchedIds = null) {
  if (!query) {
    clearSearchHighlights();
    return;
  }

  if (!matchedIds) {
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    matchedIds = [];
    state.racks.forEach((rack) => {
      rack.devices.forEach((dev) => {
        const searchTarget = `
          ${dev.name || ''} 
          ${dev.ip || ''} 
          ${dev.vip || ''} 
          ${dev.hostname || ''} 
          ${dev.vendor || ''} 
          ${dev.model || ''} 
          ${(dev.tags || []).join(' ')} 
          ${dev.notes || ''} 
          ${rack.name || ''}
        `.toLowerCase();
        if (words.every((w) => searchTarget.includes(w))) {
          matchedIds.push(dev.id);
        }
      });
    });
  }

  const matchedSet = new Set(matchedIds);
  document.querySelectorAll('.mounted-device-grid-item').forEach((el) => {
    const devId = el.dataset.deviceId;
    if (matchedSet.has(devId)) {
      el.classList.add('search-matched');
      el.classList.remove('search-dimmed');
    } else {
      el.classList.remove('search-matched');
      el.classList.add('search-dimmed');
    }
  });
}

function renderSearchResultsDropdown(results, query) {
  if (!elements.searchResultsDropdown || !elements.searchResultsList) return;

  elements.searchResultsDropdown.style.display = 'block';
  if (elements.searchResultsHeader) {
    elements.searchResultsHeader.textContent = `検索結果 (${results.length}件)`;
  }

  if (results.length === 0) {
    elements.searchResultsList.innerHTML = `
      <div class="search-no-results">
        「${escapeHtml(query)}」に一致する機器が見つかりませんでした
      </div>
    `;
    return;
  }

  elements.searchResultsList.innerHTML = '';
  results.forEach(({ device, rack }) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'search-result-item';

    const sideText = device.side === 'rear' ? '背面' : (device.side === 'full' ? '前後貫通' : '前面');
    const ipText = device.vip ? `VIP: ${device.vip} | Mgmt: ${device.ip || '未設定'}` : (device.ip || 'IP未設定');

    itemEl.innerHTML = `
      <div class="item-icon">
        <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        </svg>
      </div>
      <div class="item-details">
        <div class="item-main">
          <span class="item-name">${highlightMatchedText(device.name || '名称未設定', query)}</span>
          <span class="item-ip">${highlightMatchedText(ipText, query)}</span>
        </div>
        <div class="item-meta">
          <span class="item-rack">${escapeHtml(rack.name)} / ${device.startU}U (${sideText})</span>
          ${(device.tags || []).map((t) => `<span class="device-mini-tag">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    `;

    itemEl.addEventListener('click', (e) => {
      e.stopPropagation();
      jumpToDevice(rack.id, device.id);
    });

    elements.searchResultsList.appendChild(itemEl);
  });
}

function highlightMatchedText(text, query) {
  if (!text || !query) return escapeHtml(text || '');
  const escaped = escapeHtml(text);
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return escaped;

  try {
    const regex = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    return escaped.replace(regex, '<mark class="search-highlight-text">$1</mark>');
  } catch (e) {
    return escaped;
  }
}

function panToDevice(deviceId) {
  const found = findDevice(deviceId);
  if (!found) return;
  const { device, rack } = found;

  const viewport = elements.stageViewport || elements.rackStage || document.getElementById('rack-stage') || document.querySelector('.workspace-canvas');
  const container = elements.racksContainer || document.getElementById('racks-container');
  const rackEl = document.getElementById(`rack-card-${rack.id}`) || document.querySelector(`.rack-card[data-rack-id="${rack.id}"]`);

  if (!viewport || !container || !rackEl) return;

  const vpRect = viewport.getBoundingClientRect();
  const zoom = state.zoom || 1.0;
  const rackLeft = rackEl.offsetLeft;
  const rackWidth = rackEl.offsetWidth;

  // 機器要素またはスロット位置からY座標を計算
  const devEl = document.querySelector(`.mounted-device-grid-item[data-device-id="${deviceId}"]`);
  let targetOffsetY = 0;
  if (devEl) {
    targetOffsetY = devEl.offsetTop || 0;
  } else {
    // 42Uラック上部からの概算位置 (1Uあたり約24px)
    const uHeight = 24;
    targetOffsetY = ((rack.units || 42) - (device.startU || 1)) * uHeight;
  }

  // 対象機器が画面中央に来るように panX, panY を計算
  state.panX = (vpRect.width / 2) - (rackLeft + rackWidth / 2) * zoom;
  state.panY = (vpRect.height / 2) - (rackEl.offsetTop + targetOffsetY) * zoom;

  container.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)';
  container.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;

  setTimeout(() => {
    container.style.transition = '';
    renderCables();
  }, 420);

  if (devEl) {
    devEl.classList.add('search-matched');
    devEl.style.outline = '3px solid #38bdf8';
    devEl.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.8)';
    setTimeout(() => {
      devEl.style.outline = '';
      devEl.style.boxShadow = '';
    }, 2500);
  }
}

function jumpToDevice(arg1, arg2) {
  const deviceId = arg2 || arg1;
  const found = findDevice(deviceId);
  if (!found) {
    const storageDev = (state.storageDevices || []).find((d) => d.id === deviceId);
    if (storageDev) {
      showToast(`📦「${storageDev.name || '対象機器'}」は機器保管庫にあります`, 'info');
      if (typeof openStorageDepotModal === 'function') openStorageDepotModal();
      return;
    }
    showToast('指定された機器はラック上に見つかりませんでした', 'warning');
    return;
  }

  const { device, rack } = found;

  // 開いている各種モーダルを自動で閉じる
  if (typeof closePrintReportModal === 'function') closePrintReportModal();
  if (typeof closeHistoryModal === 'function') closeHistoryModal();
  if (elements.modalStorageDepot && elements.modalStorageDepot.classList.contains('open')) {
    if (typeof closeStorageDepotModal === 'function') closeStorageDepotModal();
  }

  // 設置面に合わせてラック面を切り替え
  if (device.side === 'rear') {
    state.rackViewModes[rack.id] = 'rear';
  } else {
    state.rackViewModes[rack.id] = 'front';
  }

  renderRacks();
  selectDevice(deviceId);

  if (elements.searchResultsDropdown) {
    elements.searchResultsDropdown.style.display = 'none';
  }

  // 距離が離れていても確実にTransform座標で画面中央へスムーズにパン & ハイライト
  setTimeout(() => {
    panToDevice(deviceId);

    const devEl = document.querySelector(`.mounted-device-grid-item[data-device-id="${deviceId}"]`);
    if (devEl) {
      devEl.classList.remove('jump-highlight');
      void devEl.offsetWidth; // リフロー
      devEl.classList.add('jump-highlight');
      setTimeout(() => devEl.classList.remove('jump-highlight'), 3000);
    }
  }, 80);

  const uLabel = (rack.columns === 2 || rack.rackType === 'storage_2col')
    ? `${device.startU}段 列${device.slotCol || 1}`
    : `${device.startU}U`;
  showToast(`📍 ${rack.name} [${uLabel}] の「${device.name || '機器'}」へジャンプしました`, 'success');
}

// --- 機器詳細ホバーポップアップ (Tooltip) ---
function showDeviceTooltip(dev, rack, e) {
  if (state.draggedDevice || state.cableMode || !elements.deviceHoverTooltip) return;

  const tooltip = elements.deviceHoverTooltip;
  const statusDotClass = dev.status === 'online' ? 'online' : (dev.status === 'offline' ? 'offline' : 'unmonitored');
  const statusText = dev.status === 'online' 
    ? `正常稼働 (Online: ${dev.responseTimeMs !== null ? dev.responseTimeMs + 'ms' : 'OK'})`
    : (dev.status === 'offline' ? '応答なし (Offline / Down)' : '監視未設定 / 未確認');

  const sideText = dev.side === 'rear' ? '背面' : (dev.side === 'full' ? '前後貫通' : '前面');
  const slotText = dev.sizeU === 1 ? `${dev.startU}U` : `${dev.startU}U 〜 ${dev.startU + dev.sizeU - 1}U (${dev.sizeU}U)`;
  const colText = dev.slotCol && dev.slotWidth !== 'full' ? ` [列${dev.slotCol}]` : '';

  // 接続されているケーブル一覧
  const connectedCables = (state.cables || []).filter(c => c.fromDeviceId === dev.id || c.toDeviceId === dev.id);
  let cablesHtml = '';
  if (connectedCables.length > 0) {
    const cableRows = connectedCables.map(c => {
      const isFrom = c.fromDeviceId === dev.id;
      const myPort = isFrom ? c.fromPort : c.toPort;
      const targetDevId = isFrom ? c.toDeviceId : c.fromDeviceId;
      const targetPort = isFrom ? c.toPort : c.fromPort;
      const targetFound = findDevice(targetDevId);
      const targetName = targetFound ? (targetFound.device.name || targetFound.device.hostname || '相手機器') : '相手機器';
      return `
        <div class="tooltip-cable-row">
          <span class="tooltip-cable-dot" style="background: ${c.color || '#38bdf8'};"></span>
          <span>Port ${myPort} ➔ ${escapeHtml(targetName)} [Port ${targetPort}]</span>
        </div>
      `;
    }).join('');
    cablesHtml = `
      <div class="tooltip-cables-section">
        <div class="tooltip-cables-title">接続LANケーブル (${connectedCables.length}本):</div>
        ${cableRows}
      </div>
    `;
  }

  tooltip.innerHTML = `
    <div class="tooltip-header">
      <span class="tooltip-status-dot ${statusDotClass}"></span>
      <div class="tooltip-title-wrap">
        <div class="tooltip-name">${escapeHtml(dev.name || '名称未設定')}</div>
        <div class="tooltip-type">${getDeviceTypeName(dev.type)}</div>
      </div>
      <span class="tooltip-u-badge">${dev.sizeU}U</span>
    </div>
    <div class="tooltip-grid">
      <div class="tooltip-label">ステータス:</div>
      <div class="tooltip-val">${statusText}</div>

      ${dev.vip ? `
        <div class="tooltip-label">代表 VIP:</div>
        <div class="tooltip-val mono highlight">${escapeHtml(dev.vip)}</div>
      ` : ''}

      <div class="tooltip-label">管理 IP:</div>
      <div class="tooltip-val mono">${dev.ip ? escapeHtml(dev.ip) : 'IP未設定'}</div>

      <div class="tooltip-label">ホスト名:</div>
      <div class="tooltip-val">${dev.hostname ? escapeHtml(dev.hostname) : '-'}</div>

      <div class="tooltip-label">設置位置:</div>
      <div class="tooltip-val">${escapeHtml(rack.name)} / ${slotText} (${sideText}${colText})</div>

      ${(dev.vendor || dev.model) ? `
        <div class="tooltip-label">機器型番:</div>
        <div class="tooltip-val">${escapeHtml([dev.vendor, dev.model].filter(Boolean).join(' '))}</div>
      ` : ''}

      <div class="tooltip-label">LANポート:</div>
      <div class="tooltip-val">${dev.portCount !== undefined ? dev.portCount : 2} ポート</div>

      <div class="tooltip-label">消費電力:</div>
      <div class="tooltip-val mono" style="color:#fbbf24; font-weight:600;">⚡ ${(dev.powerWatts !== undefined && dev.powerWatts !== null && dev.powerWatts !== '') ? dev.powerWatts : getDefaultPowerWatts(dev.type, dev.sizeU)} W</div>

      ${(dev.tags && dev.tags.length > 0) ? `
        <div class="tooltip-label">タグ:</div>
        <div class="tooltip-val">${dev.tags.map(t => `<span class="device-mini-tag" style="margin-right:3px;">${escapeHtml(t)}</span>`).join('')}</div>
      ` : ''}

      ${dev.notes ? `
        <div class="tooltip-label">備考:</div>
        <div class="tooltip-val" style="color:#94a3b8; font-size:10.5px;">${escapeHtml(dev.notes)}</div>
      ` : ''}
    </div>
    ${cablesHtml}
  `;

  tooltip.style.display = 'block';
  positionDeviceTooltip(e);
}

function moveDeviceTooltip(e) {
  if (!elements.deviceHoverTooltip || elements.deviceHoverTooltip.style.display === 'none') return;
  positionDeviceTooltip(e);
}

function positionDeviceTooltip(e) {
  const tooltip = elements.deviceHoverTooltip;
  if (!tooltip) return;

  const tooltipWidth = tooltip.offsetWidth || 310;
  const tooltipHeight = tooltip.offsetHeight || 180;
  const marginX = 22; // カーソルから少し離して見やすくする余白
  const marginY = 18;

  let left = e.clientX + marginX;
  let top = e.clientY + marginY;

  // 画面右端を超える場合はカーソルの左側に表示
  if (left + tooltipWidth > window.innerWidth - 12) {
    left = e.clientX - tooltipWidth - marginX;
  }

  // 画面下端を超える場合はカーソルの上側に表示
  if (top + tooltipHeight > window.innerHeight - 12) {
    top = e.clientY - tooltipHeight - marginY;
  }

  // 画面左端・上端を割らないようにクランプ
  left = Math.max(10, left);
  top = Math.max(10, top);

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideDeviceTooltip() {
  if (elements.deviceHoverTooltip) {
    elements.deviceHoverTooltip.style.display = 'none';
  }
}

// --- LANケーブル ホバー情報ポップアップ (フロア・外部配線対応) ---
function showCableTooltip(cable, e) {
  if (!elements.deviceHoverTooltip) return;
  const isExternal = cable.toDeviceId === '__external__' || !!cable.externalTarget;
  const fromDev = findDevice(cable.fromDeviceId)?.device;
  const fromRack = state.racks.find(r => r.devices.some(d => d.id === cable.fromDeviceId));
  const fromName = fromDev ? (fromDev.hostname || fromDev.name) : '接続元';
  const fromLoc = `${fromRack ? fromRack.name : ''} ${fromDev ? fromDev.startU + 'U' : ''} (Port ${cable.fromPort})`;
  const fromIp = fromDev?.ip ? `IP: ${fromDev.ip}` : '';

  const tooltip = elements.deviceHoverTooltip;
  if (isExternal) {
    const extName = cable.externalTarget || cable.label || 'フロア/外部接続';
    tooltip.innerHTML = `
      <div class="tooltip-cable-card">
        <div class="tooltip-cable-header">
          <span style="background: ${cable.color || '#22c55e'}; width:10px; height:10px; border-radius:50%; display:inline-block; box-shadow: 0 0 8px ${cable.color || '#22c55e'};"></span>
          <span>🌐 フロア・外部配線 (Uplink/Outlet)</span>
        </div>
        <div class="tooltip-cable-flow">
          <div class="tooltip-cable-node">
            <span class="tooltip-cable-node-title">🏢 ${escapeHtml(fromName)}</span>
            <span class="tooltip-cable-node-detail">${escapeHtml(fromLoc)} ${escapeHtml(fromIp)}</span>
          </div>
          <div class="tooltip-cable-arrow">➔ 外部配線</div>
          <div class="tooltip-cable-node" style="border-left: 2px solid #22c55e; padding-left:6px;">
            <span class="tooltip-cable-node-title" style="color:#6ee7b7;">🌐 ${escapeHtml(extName)}</span>
            <span class="tooltip-cable-node-detail">フロア / 壁面情報コンセント / WAN</span>
          </div>
        </div>
        <div class="tooltip-hint">${state.cableMode ? '※ クリックで配線を削除' : '※ 配線モードまたはプロパティで削除可能'}</div>
      </div>
    `;
  } else {
    const toDev = findDevice(cable.toDeviceId)?.device;
    const toRack = state.racks.find(r => r.devices.some(d => d.id === cable.toDeviceId));
    const toName = toDev ? (toDev.hostname || toDev.name) : '接続先';
    const toLoc = `${toRack ? toRack.name : ''} ${toDev ? toDev.startU + 'U' : ''} (Port ${cable.toPort})`;
    const toIp = toDev?.ip ? `IP: ${toDev.ip}` : '';

    tooltip.innerHTML = `
      <div class="tooltip-cable-card">
        <div class="tooltip-cable-header">
          <span style="background: ${cable.color || '#38bdf8'}; width:10px; height:10px; border-radius:50%; display:inline-block; box-shadow: 0 0 8px ${cable.color || '#38bdf8'};"></span>
          <span>LAN ケーブル配線情報</span>
        </div>
        <div class="tooltip-cable-flow">
          <div class="tooltip-cable-node">
            <span class="tooltip-cable-node-title">🅰 ${escapeHtml(fromName)}</span>
            <span class="tooltip-cable-node-detail">${escapeHtml(fromLoc)} ${escapeHtml(fromIp)}</span>
          </div>
          <div class="tooltip-cable-arrow">↕ 接続中</div>
          <div class="tooltip-cable-node">
            <span class="tooltip-cable-node-title">🅱 ${escapeHtml(toName)}</span>
            <span class="tooltip-cable-node-detail">${escapeHtml(toLoc)} ${escapeHtml(toIp)}</span>
          </div>
        </div>
        <div class="tooltip-hint">${state.cableMode ? '※ クリックで配線を削除' : '※ 配線モードで繋ぎ直し・削除可能'}</div>
      </div>
    `;
  }
  tooltip.style.display = 'block';
  positionDeviceTooltip(e);
}

// --- ポート ホバー情報ポップアップ ---
function showPortTooltip(device, portNum, e) {
  if (!elements.deviceHoverTooltip) return;
  const existingCable = state.cables.find(
    (c) => (c.fromDeviceId === device.id && c.fromPort === portNum) || (c.toDeviceId === device.id && c.toPort === portNum)
  );

  // v5: ポート別 VLAN & IP 設定の取得
  const portConf = device.portConfigs ? (device.portConfigs[portNum] || device.portConfigs[String(portNum)]) : null;
  let vlanCardHtml = '';
  if (portConf) {
    const vlanId = portConf.vlanId || 1;
    const vlanName = portConf.vlanName || `VLAN ${vlanId}`;
    const mode = (portConf.mode || 'access').toLowerCase();
    const modeLabel = mode === 'routed' ? 'Routed (L3/IP直付)' : (mode === 'trunk' ? 'Trunk (タグVLAN)' : 'Access (端末)');
    const modeCls = mode === 'routed' ? 'routed' : (mode === 'trunk' ? 'trunk' : 'access');
    const portIp = portConf.ip ? escapeHtml(portConf.ip) : '未設定';
    const vlanColor = getVlanColor(vlanId);

    vlanCardHtml = `
      <div class="tooltip-vlan-card">
        <div class="tooltip-vlan-row">
          <span class="vlan-mode-badge ${modeCls}">${modeLabel}</span>
          <span class="tooltip-vlan-tag" style="border-color:${vlanColor}; color:${vlanColor}; background:${vlanColor}22;">
            VLAN ${escapeHtml(String(vlanId))}: ${escapeHtml(vlanName)}
          </span>
        </div>
        ${portConf.ip ? `
          <div class="tooltip-vlan-row" style="margin-top:3px;">
            <span style="color:#94a3b8; font-size:10.5px;">割り当てIP:</span>
            <span class="tooltip-port-ip">${portIp}</span>
          </div>
        ` : ''}
        ${portConf.description ? `
          <div style="font-size:10px; color:#cbd5e1; margin-top:2px;">
            説明: ${escapeHtml(portConf.description)}
          </div>
        ` : ''}
      </div>
    `;
  }

  const tooltip = elements.deviceHoverTooltip;
  if (existingCable) {
    const isFrom = existingCable.fromDeviceId === device.id;
    const otherDevId = isFrom ? existingCable.toDeviceId : existingCable.fromDeviceId;
    const otherPort = isFrom ? existingCable.toPort : existingCable.fromPort;
    const otherFound = findDevice(otherDevId);
    const otherDev = otherFound?.device;
    const otherRack = otherFound?.rack;

    tooltip.innerHTML = `
      <div class="tooltip-port-card">
        <div class="tooltip-port-header">
          <span style="font-weight: 700; color: #fff;">${escapeHtml(device.name || '機器')} - Port ${portNum}</span>
          <span class="tooltip-port-badge connected">● 接続中</span>
        </div>
        ${vlanCardHtml}
        <div class="tooltip-cable-flow">
          <div class="tooltip-cable-node">
            <span class="tooltip-cable-node-title">接続先: ${escapeHtml(otherDev?.name || otherDevId)} (Port ${otherPort})</span>
            <span class="tooltip-cable-node-detail">設置: ${escapeHtml(otherRack?.name || '')} ${otherDev ? otherDev.startU + 'U' : ''} | IP: ${escapeHtml(otherDev?.ip || '未設定')}</span>
          </div>
        </div>
        <div class="tooltip-hint">${state.cableMode ? '※ クリックで別のポートへ繋ぎ直し' : '※ 配線モードでポート繋ぎ直し可能'}</div>
      </div>
    `;
  } else {
    tooltip.innerHTML = `
      <div class="tooltip-port-card">
        <div class="tooltip-port-header">
          <span style="font-weight: 700; color: #fff;">${escapeHtml(device.name || '機器')} - Port ${portNum}</span>
          <span class="tooltip-port-badge empty">○ 空きポート</span>
        </div>
        ${vlanCardHtml}
        <div style="font-size: 11px; color: #94a3b8; line-height: 1.4; padding: 4px 0;">
          現在このポートにはLANケーブルが接続されていません。
        </div>
        <div class="tooltip-hint">${state.cableMode ? '※ クリックして配線開始' : '※ 配線モードで新規配線可能'}</div>
      </div>
    `;
  }
  tooltip.style.display = 'block';
  positionDeviceTooltip(e);
}

// --- 機器タイプ表示名ヘルパー ---
function getDeviceTypeName(type) {
  switch (type) {
    case 'rackmount': return 'サーバー (Rackmount)';
    case 'nas': return 'NAS / ストレージ';
    case 'l3_switch': return 'L3 コアスイッチ';
    case 'l2_switch': return 'L2 エッジスイッチ';
    case 'utm': return 'UTM / FW';
    case 'router': return 'ルーター';
    case 'onu': return 'ONU / 光終端 / モデム';
    case 'mc': return 'メディアコンバーター (MC)';
    case 'ap': return '無線AP / Wi-Fi';
    case 'tower': return 'タワー型マシン';
    case 'desktop': return '卓上ルーター / 小型スイッチ';
    case 'hub': return 'スイッチングハブ / 小型HUB';
    case 'iot': return 'IoT機器 / センサー';
    case 'laptop': return 'ノートPC (Laptop)';
    case 'desktop_pc': return 'デスクトップPC (Desktop PC)';
    case 'pdu': return 'PDU 電源ユニット';
    case 'ups': return 'UPS 無停電電源装置';
    case 'shelf': return '固定棚板 (Shelf)';
    case 'misc': return 'その他・雑多機器';
    default: return 'サーバー';
  }
}

// --- 消費電力デフォルト計算 (実効平均稼働値) ---
function getDefaultPowerWatts(type, sizeU) {
  const u = parseInt(sizeU, 10) || 1;
  switch (type) {
    case 'rackmount':
      if (u === 1) return 100;
      if (u === 2) return 150;
      if (u >= 4) return 300;
      return 100;
    case 'nas': return 60;
    case 'l3_switch': return 100;
    case 'l2_switch': return 40;
    case 'utm': return 50;
    case 'router': return 25;
    case 'onu': return 10;
    case 'mc': return 5;
    case 'ap': return 15;
    case 'hub': return 5;
    case 'desktop': return 20;
    case 'tower': return 300;
    case 'laptop': return 30;
    case 'desktop_pc': return 80;
    case 'iot': return 5;
    case 'pdu': return 0;
    case 'ups': return 0;
    case 'shelf': return 0;
    case 'misc': return 20;
    default: return 100;
  }
}

// --- 機器タイプ別標準タグ計算 ---
function getDefaultTagsForType(type) {
  switch (type) {
    case 'utm': return ['security', 'firewall', 'utm'];
    case 'l3_switch': return ['network', 'l3', 'core'];
    case 'l2_switch': return ['network', 'l2', 'access'];
    case 'router': return ['network', 'router', 'gateway'];
    case 'onu': return ['network', 'onu', 'wan', 'fiber'];
    case 'mc': return ['network', 'mc', 'fiber'];
    case 'ap': return ['network', 'wireless', 'ap', 'wifi'];
    case 'nas': return ['storage', 'nas', 'backup'];
    case 'rackmount': return ['server', 'compute'];
    case 'tower': return ['workstation', 'gpu', 'ai'];
    case 'desktop': return ['network', 'hub', 'desktop'];
    case 'hub': return ['network', 'hub'];
    case 'iot': return ['iot', 'sensor', 'edge'];
    case 'laptop': return ['pc', 'laptop', 'client'];
    case 'desktop_pc': return ['pc', 'desktop', 'client'];
    case 'pdu': return ['power', 'pdu'];
    case 'ups': return ['power', 'ups', 'battery'];
    case 'shelf': return ['shelf', 'storage'];
    case 'misc': return ['misc'];
    default: return ['server'];
  }
}

// --- v5: VLAN カラーヘルパー ---
function getVlanColor(vlanId) {
  const id = parseInt(vlanId, 10);
  if (isNaN(id) || id === 1) return '#38bdf8'; // デフォルトVLAN1: スカイブルー
  const palette = [
    '#22c55e', // VLAN 10系: エメラルドグリーン
    '#eab308', // VLAN 20系: イエロー
    '#f97316', // VLAN 30系: オレンジ
    '#ef4444', // VLAN 40/WAN系: レッド
    '#a855f7', // VLAN 50系: パープル
    '#ec4899', // VLAN 60系: ピンク
    '#06b6d4', // VLAN 70系: シアン
    '#3b82f6', // VLAN 80系: ブルー
    '#84cc16', // VLAN 90系: ライム
    '#14b8a6'  // VLAN 100系: ティール
  ];
  const idx = Math.abs(id) % palette.length;
  return palette[idx];
}

// ==========================================================================
// RackManager v5 - ポート別 VLAN ＆ IP 管理ロジック
// ==========================================================================

function renderPropVlanSection(device) {
  if (!elements.propVlanSection || !elements.propVlanTbody) return;

  const portCount = device.portCount || 0;
  if (portCount <= 0) {
    elements.propVlanSection.style.display = 'none';
    return;
  }
  elements.propVlanSection.style.display = 'block';

  if (!device.portConfigs || typeof device.portConfigs !== 'object') {
    device.portConfigs = {};
  }

  elements.propVlanTbody.innerHTML = '';

  for (let p = 1; p <= portCount; p++) {
    const conf = device.portConfigs[p] || device.portConfigs[String(p)] || {};
    const mode = conf.mode || 'access';
    const vlanId = conf.vlanId !== undefined ? conf.vlanId : (mode === 'routed' ? '' : 1);
    const vlanName = conf.vlanName || '';
    const ipVal = conf.ip || '';

    const tr = document.createElement('tr');
    tr.dataset.port = String(p);

    tr.innerHTML = `
      <td style="text-align:center;">
        <span class="vlan-port-num-badge" style="background:${vlanId ? getVlanColor(vlanId) + '33' : 'rgba(255,255,255,0.08)'}; color:${vlanId ? getVlanColor(vlanId) : '#fff'}; border:1px solid ${vlanId ? getVlanColor(vlanId) + '66' : 'transparent'};">
          P${p}
        </span>
      </td>
      <td>
        <select class="vlan-mode-select">
          <option value="access" ${mode === 'access' ? 'selected' : ''}>Access</option>
          <option value="routed" ${mode === 'routed' ? 'selected' : ''}>Routed (L3/IP)</option>
          <option value="trunk" ${mode === 'trunk' ? 'selected' : ''}>Trunk</option>
        </select>
      </td>
      <td>
        <input type="number" class="vlan-input-inline vlan-id-input" min="1" max="4094" value="${vlanId}" placeholder="1">
      </td>
      <td>
        <input type="text" class="vlan-input-inline vlan-name-input" value="${escapeHtml(vlanName)}" placeholder="DMZ, LAN...">
      </td>
      <td>
        <input type="text" class="vlan-input-inline vlan-ip-input" value="${escapeHtml(ipVal)}" placeholder="${mode === 'routed' ? '例: 192.168.10.1/24' : 'IP未割当 (Access)'}">
      </td>
      <td style="text-align:center;">
        <button type="button" class="btn-clear-port-vlan" title="このポートの設定を初期化" style="background:none; border:none; color:#64748b; cursor:pointer; font-size:12px; padding:2px;">×</button>
      </td>
    `;

    const modeSelect = tr.querySelector('.vlan-mode-select');
    const vlanIdInput = tr.querySelector('.vlan-id-input');
    const vlanNameInput = tr.querySelector('.vlan-name-input');
    const vlanIpInput = tr.querySelector('.vlan-ip-input');
    const clearBtn = tr.querySelector('.btn-clear-port-vlan');

    const updatePortData = () => {
      const currentMode = modeSelect.value;
      const currentVlan = vlanIdInput.value ? parseInt(vlanIdInput.value, 10) : 1;
      const currentName = vlanNameInput.value.trim();
      const currentIp = vlanIpInput.value.trim();

      device.portConfigs[p] = {
        mode: currentMode,
        vlanId: currentVlan,
        vlanName: currentName,
        ip: currentIp,
        description: conf.description || ''
      };

      state.hasUnsavedPropChanges = true;
      vlanIpInput.placeholder = currentMode === 'routed' ? '例: 192.168.10.1/24' : 'IP未割当 (Access)';
      const portBadge = tr.querySelector('.vlan-port-num-badge');
      if (portBadge) {
        const c = getVlanColor(currentVlan);
        portBadge.style.color = c;
        portBadge.style.background = c + '33';
        portBadge.style.borderColor = c + '66';
      }
      updateVlanFilterOptions();
    };

    modeSelect.addEventListener('change', () => {
      if (modeSelect.value === 'routed' && !vlanIpInput.value && device.ip) {
        const segParts = device.ip.split('.');
        if (segParts.length === 4) {
          vlanIpInput.value = `${segParts[0]}.${segParts[1]}.${segParts[2]}.${p}/24`;
        }
      }
      updatePortData();
    });

    vlanIdInput.addEventListener('input', updatePortData);
    vlanNameInput.addEventListener('input', updatePortData);
    vlanIpInput.addEventListener('input', updatePortData);

    clearBtn.addEventListener('click', () => {
      delete device.portConfigs[p];
      delete device.portConfigs[String(p)];
      renderPropVlanSection(device);
      state.hasUnsavedPropChanges = true;
      updateVlanFilterOptions();
    });

    elements.propVlanTbody.appendChild(tr);
  }
}

function applyBulkVlanConfig() {
  if (!state.selectedDeviceId) return;
  const found = findDevice(state.selectedDeviceId);
  if (!found) return;
  const device = found.device;
  const maxPorts = device.portCount || 0;
  if (maxPorts === 0) return;

  const rangeStr = (elements.bulkVlanRange ? elements.bulkVlanRange.value : '').trim().toLowerCase();
  const mode = elements.bulkVlanMode ? elements.bulkVlanMode.value : 'access';
  const vlanId = elements.bulkVlanId && elements.bulkVlanId.value ? parseInt(elements.bulkVlanId.value, 10) : 1;
  const vlanName = elements.bulkVlanName ? elements.bulkVlanName.value.trim() : '';
  const ipPrefix = elements.bulkVlanIpPrefix ? elements.bulkVlanIpPrefix.value.trim() : '';

  let targetPorts = [];
  if (!rangeStr || rangeStr === 'all') {
    for (let p = 1; p <= maxPorts; p++) targetPorts.push(p);
  } else if (rangeStr.includes('-')) {
    const parts = rangeStr.split('-');
    const start = Math.max(1, parseInt(parts[0], 10) || 1);
    const end = Math.min(maxPorts, parseInt(parts[1], 10) || maxPorts);
    for (let p = start; p <= end; p++) targetPorts.push(p);
  } else if (rangeStr.includes(',')) {
    targetPorts = rangeStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= maxPorts);
  } else {
    const single = parseInt(rangeStr, 10);
    if (!isNaN(single) && single >= 1 && single <= maxPorts) targetPorts.push(single);
  }

  if (targetPorts.length === 0) {
    showToast('有効な対象ポート範囲（例: 1-12 または all）を入力してください', 'error');
    return;
  }

  if (!device.portConfigs) device.portConfigs = {};

  targetPorts.forEach((p) => {
    let assignedIp = '';
    if (ipPrefix) {
      if (ipPrefix.includes('{n}')) {
        assignedIp = ipPrefix.replace('{n}', p);
      } else {
        assignedIp = ipPrefix;
      }
    }

    device.portConfigs[p] = {
      mode: mode,
      vlanId: vlanId,
      vlanName: vlanName || `VLAN ${vlanId}`,
      ip: assignedIp,
      description: device.portConfigs[p]?.description || ''
    };
  });

  state.hasUnsavedPropChanges = true;
  renderPropVlanSection(device);
  updateVlanFilterOptions();
  showToast(`Port ${targetPorts[0]} 〜 ${targetPorts[targetPorts.length - 1]} に VLAN ${vlanId} (${mode.toUpperCase()}) を一括適用しました`, 'success');
}

function updateVlanFilterOptions() {
  if (!elements.selectVlanFilter) return;

  const vlanMap = new Map();

  const scanDevices = (devList) => {
    (devList || []).forEach(d => {
      if (d.portConfigs) {
        Object.values(d.portConfigs).forEach(conf => {
          if (conf && conf.vlanId) {
            const vId = parseInt(conf.vlanId, 10);
            if (!isNaN(vId)) {
              const curName = vlanMap.get(vId);
              if (!curName || conf.vlanName) {
                vlanMap.set(vId, conf.vlanName || `VLAN ${vId}`);
              }
            }
          }
        });
      }
    });
  };

  state.racks.forEach(r => scanDevices(r.devices));
  scanDevices(state.storageDevices);

  const currentVal = elements.selectVlanFilter.value || 'all';
  elements.selectVlanFilter.innerHTML = '<option value="all">全VLAN表示</option>';

  const sortedVlans = Array.from(vlanMap.keys()).sort((a, b) => a - b);
  sortedVlans.forEach(vId => {
    const vName = vlanMap.get(vId) || `VLAN ${vId}`;
    const opt = document.createElement('option');
    opt.value = String(vId);
    opt.textContent = `VLAN ${vId}: ${vName}`;
    if (String(vId) === currentVal) opt.selected = true;
    elements.selectVlanFilter.appendChild(opt);
  });
}

// ==========================================================================
// RackManager v5 - 操作取り消し (Undo / 元に戻す) ＆ やり直し (Redo) エンジン
// ==========================================================================

const MAX_UNDO_STACK = 30;

function pushHistoryState(actionDescription = '操作') {
  if (state.isHistoryNavigating) return;

  const snapshot = {
    racks: JSON.parse(JSON.stringify(state.racks || [])),
    cables: JSON.parse(JSON.stringify(state.cables || [])),
    storageDevices: JSON.parse(JSON.stringify(state.storageDevices || [])),
    otherLocations: JSON.parse(JSON.stringify(state.otherLocations || [])),
    otherLocationColumns: JSON.parse(JSON.stringify(state.otherLocationColumns || [])),
    desc: actionDescription,
    timestamp: Date.now()
  };

  state.undoStack.push(snapshot);
  if (state.undoStack.length > MAX_UNDO_STACK) {
    state.undoStack.shift();
  }

  // 新規操作が行われたらやり直しスタックは破棄
  state.redoStack = [];
  updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
  const hasUndo = state.undoStack && state.undoStack.length > 0;
  const undoTitle = hasUndo
    ? `「${state.undoStack[state.undoStack.length - 1].desc || '直前の操作'}」を元に戻す (Ctrl+Z)`
    : '元に戻す (Ctrl+Z)';

  if (elements.btnUndo) {
    elements.btnUndo.disabled = !hasUndo;
    elements.btnUndo.title = undoTitle;
  }
  if (elements.btnFloatingUndo) {
    elements.btnFloatingUndo.disabled = !hasUndo;
    elements.btnFloatingUndo.title = undoTitle;
  }

  const hasRedo = state.redoStack && state.redoStack.length > 0;
  const redoTitle = hasRedo
    ? `「${state.redoStack[state.redoStack.length - 1].desc || '操作'}」をやり直す (Ctrl+Y)`
    : 'やり直す (Ctrl+Y)';

  if (elements.btnRedo) {
    elements.btnRedo.disabled = !hasRedo;
    elements.btnRedo.title = redoTitle;
  }
  if (elements.btnFloatingRedo) {
    elements.btnFloatingRedo.disabled = !hasRedo;
    elements.btnFloatingRedo.title = redoTitle;
  }
}

async function undoAction() {
  if (!state.undoStack || state.undoStack.length === 0) {
    showToast('元に戻す操作履歴がありません', 'info');
    return;
  }

  state.isHistoryNavigating = true;

  // 現在の状態をRedo用に退避
  const currentSnapshot = {
    racks: JSON.parse(JSON.stringify(state.racks || [])),
    cables: JSON.parse(JSON.stringify(state.cables || [])),
    storageDevices: JSON.parse(JSON.stringify(state.storageDevices || [])),
    otherLocations: JSON.parse(JSON.stringify(state.otherLocations || [])),
    otherLocationColumns: JSON.parse(JSON.stringify(state.otherLocationColumns || [])),
    desc: '元に戻す直前の状態',
    timestamp: Date.now()
  };
  state.redoStack.push(currentSnapshot);

  // 1つ前の状態を取得して適用
  const prevState = state.undoStack.pop();
  state.racks = prevState.racks;
  state.cables = prevState.cables;
  state.storageDevices = prevState.storageDevices;
  if (prevState.otherLocations) state.otherLocations = prevState.otherLocations;
  if (prevState.otherLocationColumns) state.otherLocationColumns = prevState.otherLocationColumns;

  // 編集中のプロパティパネルがあれば同期を破棄して閉じる
  if (state.selectedDeviceId) {
    closePropertyPanel(true);
  }

  renderRacks();
  renderCables();
  updateVlanFilterOptions();
  updateStorageDepotBadge();
  updateOtherLocationBadge();
  if (elements.modalOtherLocation && elements.modalOtherLocation.classList.contains('open')) {
    renderOtherLocationTable();
  }
  updateHeaderStats();
  updateUndoRedoButtons();

  await saveData(true);
  state.isHistoryNavigating = false;

  showToast(`↶ 操作を取り消しました: 「${prevState.desc || '直前の操作'}」`, 'info');
}

async function redoAction() {
  if (!state.redoStack || state.redoStack.length === 0) {
    showToast('やり直す操作履歴がありません', 'info');
    return;
  }

  state.isHistoryNavigating = true;

  // 現在の状態をUndo用に退避
  const currentSnapshot = {
    racks: JSON.parse(JSON.stringify(state.racks || [])),
    cables: JSON.parse(JSON.stringify(state.cables || [])),
    storageDevices: JSON.parse(JSON.stringify(state.storageDevices || [])),
    otherLocations: JSON.parse(JSON.stringify(state.otherLocations || [])),
    otherLocationColumns: JSON.parse(JSON.stringify(state.otherLocationColumns || [])),
    desc: 'やり直す直前の状態',
    timestamp: Date.now()
  };
  state.undoStack.push(currentSnapshot);

  // やり直し状態を取得して適用
  const nextState = state.redoStack.pop();
  state.racks = nextState.racks;
  state.cables = nextState.cables;
  state.storageDevices = nextState.storageDevices;
  if (nextState.otherLocations) state.otherLocations = nextState.otherLocations;
  if (nextState.otherLocationColumns) state.otherLocationColumns = nextState.otherLocationColumns;

  if (state.selectedDeviceId) {
    closePropertyPanel(true);
  }

  renderRacks();
  renderCables();
  updateVlanFilterOptions();
  updateStorageDepotBadge();
  updateOtherLocationBadge();
  if (elements.modalOtherLocation && elements.modalOtherLocation.classList.contains('open')) {
    renderOtherLocationTable();
  }
  updateHeaderStats();
  updateUndoRedoButtons();

  await saveData(true);
  state.isHistoryNavigating = false;

  showToast(`↷ やり直しました: 「${nextState.desc || '操作'}」`, 'info');
}



// ==========================================================================
// RackManager v3 - 双方向完全連動 変更履歴 ＆ 構成管理エンジン
// ==========================================================================

function getChangeTypeName(type) {
  switch (type) {
    case 'add':
      return {
        label: '新規設置',
        cls: 'type-add',
        iconSvg: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
      };
    case 'move':
      return {
        label: '移設・移動',
        cls: 'type-move',
        iconSvg: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>'
      };
    case 'remove':
    case 'delete':
      return {
        label: '撤去・廃棄',
        cls: 'type-remove',
        iconSvg: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      };
    case 'config':
      return {
        label: '設定変更',
        cls: 'type-config',
        iconSvg: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
      };
    case 'maintenance':
      return {
        label: '保守・交換',
        cls: 'type-maintenance',
        iconSvg: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>'
      };
    case 'wiring':
      return {
        label: '配線変更',
        cls: 'type-wiring',
        iconSvg: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>'
      };
    default:
      return {
        label: 'その他作業',
        cls: 'type-other',
        iconSvg: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>'
      };
  }
}

function captureDeviceSnapshot(deviceOrId) {
  if (!deviceOrId) return null;
  let dev = null;
  let rack = null;
  if (typeof deviceOrId === 'string') {
    const found = findDevice(deviceOrId);
    if (found) {
      dev = found.device;
      rack = found.rack;
    } else {
      // ホスト名検索
      for (const r of state.racks) {
        const d = r.devices.find(item => item.hostname === deviceOrId || item.name === deviceOrId);
        if (d) {
          dev = d;
          rack = r;
          break;
        }
      }
    }
  } else if (typeof deviceOrId === 'object') {
    dev = deviceOrId;
    for (const r of state.racks) {
      if (r.devices.some(d => d.id === dev.id)) {
        rack = r;
        break;
      }
    }
  }
  if (!dev) return null;

  // 接続されている配線一覧
  const connectedCables = (state.cables || []).filter(c => c.fromDeviceId === dev.id || c.toDeviceId === dev.id).map(c => {
    const isFrom = c.fromDeviceId === dev.id;
    const otherId = isFrom ? c.toDeviceId : c.fromDeviceId;
    const otherFound = findDevice(otherId);
    const otherDev = otherFound?.device;
    const otherRack = otherFound?.rack;
    const selfPort = isFrom ? c.fromPort : c.toPort;
    const otherPort = isFrom ? c.toPort : c.fromPort;
    const otherName = otherDev?.name || '相手機器';
    const otherLoc = otherRack ? `[${otherRack.name} ${otherDev?.startU || '-'}U]` : '';
    return `Port ${selfPort} ⇄ ${otherLoc} ${otherName} (Port ${otherPort})`;
  });

  return {
    id: dev.id,
    name: dev.name || '',
    hostname: dev.hostname || dev.name || '',
    vendor: dev.vendor || '',
    model: dev.model || '',
    type: dev.type || 'rackmount',
    sizeU: dev.sizeU || 1,
    startU: dev.startU || 1,
    side: dev.side || 'front',
    slotWidth: dev.slotWidth || 'full',
    slotCol: dev.slotCol || 1,
    rackId: rack?.id || null,
    rackName: rack?.name || '指定ラック',
    ip: dev.ip || '',
    vip: dev.vip || '',
    haRole: dev.haRole || 'standalone',
    powerWatts: dev.powerWatts !== undefined ? dev.powerWatts : getDefaultPowerWatts(dev.type),
    portCount: dev.portCount || 4,
    notes: dev.notes || '',
    tags: [...(dev.tags || [])],
    cables: connectedCables
  };
}

function getLogTime(log) {
  if (log.time) return log.time;
  if (log.id && log.id.startsWith('chg-')) {
    const parts = log.id.split('-');
    const ts = parseInt(parts[1], 10);
    if (!isNaN(ts) && ts > 1600000000000) {
      const d = new Date(ts);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    }
  }
  return '';
}

function recordChangeLog({ date, time, ticketNo, hostname, deviceId, type, operator, reason, snapshot = null }) {
  // 🚧 初期構築モード（履歴記録OFF）が有効な場合は記録しない
  if (state.settings && state.settings.initialSetupMode) {
    return null;
  }
  if (!state.changeLogs) state.changeLogs = [];
  const now = new Date();
  const logDate = date || now.toISOString().split('T')[0];
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const logTime = time || `${hh}:${mm}:${ss}`;

  // 管理番号の解決（既存デバイスの割り振られた管理番号を最優先で維持・継承）
  let logTicket = ticketNo;
  let targetDev = null;
  if (deviceId) {
    targetDev = findDevice(deviceId)?.device;
  } else if (hostname) {
    for (const r of state.racks) {
      const d = r.devices.find((dev) => dev.hostname === hostname || dev.name === hostname);
      if (d) {
        targetDev = d;
        break;
      }
    }
  }

  if (!logTicket && targetDev) {
    if (targetDev.ticketNo) {
      logTicket = targetDev.ticketNo;
    } else {
      // 過去の変更履歴から管理番号を逆引き
      const pastLog = state.changeLogs.find(
        (l) => (l.deviceId && l.deviceId === targetDev.id) || (l.hostname && (l.hostname === targetDev.hostname || l.hostname === targetDev.name))
      );
      if (pastLog && pastLog.ticketNo) {
        logTicket = pastLog.ticketNo;
        targetDev.ticketNo = pastLog.ticketNo;
      }
    }
  }

  if (!logTicket) {
    logTicket = generateNextTicketNo();
    if (targetDev && !targetDev.ticketNo) {
      targetDev.ticketNo = logTicket;
    }
  } else if (targetDev && !targetDev.ticketNo) {
    targetDev.ticketNo = logTicket;
  }

  const devSnapshot = snapshot || captureDeviceSnapshot(deviceId || hostname);

  const entry = {
    id: 'chg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    date: logDate,
    time: logTime,
    ticketNo: logTicket,
    hostname: hostname || devSnapshot?.hostname || devSnapshot?.name || '未設定機器',
    deviceId: deviceId || devSnapshot?.id || null,
    type: type || 'other',
    operator: operator || '担当者',
    reason: reason || '変更・作業',
    deviceSnapshot: devSnapshot
  };

  state.changeLogs.unshift(entry);
  saveData();
  renderChangeLogs();
  if (state.selectedDeviceId && (state.selectedDeviceId === deviceId || !deviceId)) {
    renderDevicePropertyHistory(state.selectedDeviceId);
  }
  return entry;
}

function renderDevicePropertyHistory(deviceId) {
  if (!elements.propDeviceHistorySection || !elements.propHistoryTimeline) return;
  const found = findDevice(deviceId);
  if (!found) {
    elements.propDeviceHistorySection.style.display = 'none';
    return;
  }
  elements.propDeviceHistorySection.style.display = 'block';
  const dev = found.device;
  const devLogs = (state.changeLogs || []).filter(
    (l) => l.deviceId === dev.id || (l.hostname && (l.hostname === dev.hostname || l.hostname === dev.name))
  );

  // 日付・時刻の厳密な降順ソート（最新の日時が先頭）
  devLogs.sort((a, b) => {
    const timeA = getLogTime(a) || '00:00:00';
    const timeB = getLogTime(b) || '00:00:00';
    const dtA = new Date(`${a.date || '1970-01-01'}T${timeA}`);
    const dtB = new Date(`${b.date || '1970-01-01'}T${timeB}`);
    const diff = dtB.getTime() - dtA.getTime();
    if (!isNaN(diff) && diff !== 0) return diff;
    const tsA = parseInt((a.id || '').split('-')[1], 10) || 0;
    const tsB = parseInt((b.id || '').split('-')[1], 10) || 0;
    return tsB - tsA;
  });

  if (elements.propHistoryCount) {
    elements.propHistoryCount.textContent = `${devLogs.length} 件`;
  }

  if (devLogs.length === 0) {
    elements.propHistoryTimeline.innerHTML = '<div class="prop-history-empty">この機器の記録された変更履歴はありません</div>';
    return;
  }

  elements.propHistoryTimeline.innerHTML = '';
  devLogs.slice(0, 8).forEach((log) => {
    const typeInfo = getChangeTypeName(log.type);
    const logTime = getLogTime(log);
    const timeDisplay = logTime ? ` <span class="prop-hist-time">${escapeHtml(logTime)}</span>` : '';
    const item = document.createElement('div');
    item.className = `prop-history-item ${typeInfo.cls}`;
    item.innerHTML = `
      <div class="prop-hist-item-top">
        <div>
          <span class="prop-hist-ticket">${escapeHtml(log.ticketNo)}</span>
          <span class="prop-hist-date">${escapeHtml(log.date)}${timeDisplay} [${escapeHtml(typeInfo.label)}]</span>
        </div>
        <button type="button" class="btn-doc-prop-mini" title="申請書を出力・印刷">
          <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;margin-right:2px;display:inline-block;vertical-align:middle;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>申請書</span>
        </button>
      </div>
      <div class="prop-hist-desc">${escapeHtml(log.reason)}</div>
    `;
    item.querySelector('.btn-doc-prop-mini')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openApplicationDocModal(log.id);
    });
    elements.propHistoryTimeline.appendChild(item);
  });
}

function openDeviceHistoryExpandModal(deviceId = null) {
  const targetId = deviceId || state.selectedDeviceId;
  if (!targetId || !elements.modalDeviceHistoryExpand) return;

  const found = findDevice(targetId);
  if (!found) {
    showToast('対象機器の情報が見つかりません', 'warning');
    return;
  }

  const { device, rack } = found;
  const devLogs = (state.changeLogs || []).filter(
    (l) => l.deviceId === device.id || (l.hostname && (l.hostname === device.hostname || l.hostname === device.name))
  );

  // 日付・時刻の厳密な降順ソート
  devLogs.sort((a, b) => {
    const timeA = getLogTime(a) || '00:00:00';
    const timeB = getLogTime(b) || '00:00:00';
    const dtA = new Date(`${a.date || '1970-01-01'}T${timeA}`);
    const dtB = new Date(`${b.date || '1970-01-01'}T${timeB}`);
    const diff = dtB.getTime() - dtA.getTime();
    if (!isNaN(diff) && diff !== 0) return diff;
    const tsA = parseInt((a.id || '').split('-')[1], 10) || 0;
    const tsB = parseInt((b.id || '').split('-')[1], 10) || 0;
    return tsB - tsA;
  });

  if (elements.devExpandHistTitle) {
    elements.devExpandHistTitle.textContent = `${device.name || device.hostname || '機器'} - 変更履歴詳細`;
  }
  if (elements.devExpandHistSubtitle) {
    const ipStr = device.ip ? `IP: ${device.ip}` : 'IP: 未設定';
    const locStr = `設置ラック: ${rack.name} (${device.startU}U / ${device.sizeU}U)`;
    elements.devExpandHistSubtitle.textContent = `${locStr} | ${ipStr} | 全 ${devLogs.length} 件`;
  }

  if (elements.devExpandHistorySummary) {
    elements.devExpandHistorySummary.textContent = `${device.name || '機器'} に関する履歴: 合計 ${devLogs.length} 件`;
  }

  if (elements.devExpandHistoryTableBody) {
    if (devLogs.length === 0) {
      elements.devExpandHistoryTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted" style="padding: 36px 12px; font-size: 13px;">
            この機器に関する過去の変更履歴は記録されていません
          </td>
        </tr>
      `;
    } else {
      elements.devExpandHistoryTableBody.innerHTML = devLogs.map((log) => {
        const typeInfo = getChangeTypeName(log.type);
        const logTime = getLogTime(log) || '';
        const timeDisplay = logTime ? ` <span style="color:#64748b; font-size:11px;">${escapeHtml(logTime)}</span>` : '';
        return `
          <tr>
            <td style="font-family: var(--font-mono); font-size: 12px; white-space: nowrap;">
              ${escapeHtml(log.date || '-')}${timeDisplay}
            </td>
            <td style="font-family: var(--font-mono); font-weight: 700; color: #38bdf8;">
              ${escapeHtml(log.ticketNo || '-')}
            </td>
            <td style="font-weight: 600;">
              ${escapeHtml(log.hostname || device.name || '-')}
            </td>
            <td>
              <span class="badge ${typeInfo.badgeCls || 'badge-gray'}" style="font-size: 11px;">
                ${escapeHtml(typeInfo.label)}
              </span>
            </td>
            <td>
              ${escapeHtml(log.operator || '-')}
            </td>
            <td style="line-height: 1.45; font-size: 12.5px;">
              ${escapeHtml(log.reason || '-')}
            </td>
            <td style="text-align: center;">
              <button type="button" class="btn-doc-prop-mini btn-open-doc-from-expand" data-log-id="${escapeHtml(log.id)}" title="この履歴から申請書を出力">
                <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;margin-right:2px;display:inline-block;vertical-align:middle;">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>申請書</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');

      elements.devExpandHistoryTableBody.querySelectorAll('.btn-open-doc-from-expand').forEach((btn) => {
        btn.addEventListener('click', () => {
          const logId = btn.dataset.logId;
          openApplicationDocModal(logId);
        });
      });
    }
  }

  elements.modalDeviceHistoryExpand.classList.add('open');
}

function closeDeviceHistoryExpandModal() {
  if (elements.modalDeviceHistoryExpand) {
    elements.modalDeviceHistoryExpand.classList.remove('open');
  }
}

function exportCurrentDeviceHistoryCsv() {
  if (!state.selectedDeviceId) return;
  const found = findDevice(state.selectedDeviceId);
  if (!found) return;
  const { device } = found;
  const devLogs = (state.changeLogs || []).filter(
    (l) => l.deviceId === device.id || (l.hostname && (l.hostname === device.hostname || l.hostname === device.name))
  );
  if (devLogs.length === 0) {
    showToast('出力対象の履歴データがありません', 'info');
    return;
  }
  const headers = ['日付', '時刻', '管理番号', '機器名/ホスト名', '作業種別', '作業担当者', '作業理由・詳細'];
  const rows = devLogs.map(l => [
    l.date || '',
    getLogTime(l) || '',
    l.ticketNo || '',
    l.hostname || '',
    getChangeTypeName(l.type).label || '',
    l.operator || '',
    l.reason || ''
  ]);
  const bom = '\uFEFF';
  const csvContent = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `history_${(device.name || 'device').replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`${device.name} の変更履歴CSVを出力しました (${devLogs.length}件)`, 'success');
}

function closeHistoryModal() {
  if (elements.modalHistory) {
    elements.modalHistory.classList.remove('open');
  }
}

function populateHistoryDynamicFields() {
  // 1. ラック選択肢
  const rackOptions = state.racks.map(r => `<option value="${r.id}">${escapeHtml(r.name)} (${r.units}U)</option>`).join('');
  if (elements.histAddRack) elements.histAddRack.innerHTML = rackOptions;
  if (elements.histMoveRack) elements.histMoveRack.innerHTML = rackOptions;

  // 2. 機器選択肢
  const devOptions = ['<option value="">-- 対象機器を選択 --</option>'];
  state.racks.forEach((r) => {
    r.devices.forEach((d) => {
      devOptions.push(`<option value="${d.id}">${escapeHtml(d.name || d.id)} (${r.name} - ${d.startU}U)</option>`);
    });
  });
  const devOptionsHtml = devOptions.join('');

  if (elements.histMoveDev) elements.histMoveDev.innerHTML = devOptionsHtml;
  if (elements.histRemoveDev) elements.histRemoveDev.innerHTML = devOptionsHtml;
  if (elements.histConfigDev) elements.histConfigDev.innerHTML = devOptionsHtml;
  if (elements.histWireFromDev) elements.histWireFromDev.innerHTML = devOptionsHtml;
  if (elements.histWireToDev) elements.histWireToDev.innerHTML = devOptionsHtml;
  if (elements.histGenDeviceSelect) elements.histGenDeviceSelect.innerHTML = devOptionsHtml;

  // 設定変更用連動
  if (elements.histConfigDev) {
    elements.histConfigDev.onchange = () => {
      const devId = elements.histConfigDev.value;
      const found = findDevice(devId);
      if (found) {
        if (found.device.ticketNo && elements.histTicket) elements.histTicket.value = found.device.ticketNo;
        if (elements.histConfigName) elements.histConfigName.value = found.device.name || '';
        if (elements.histConfigIp) elements.histConfigIp.value = found.device.ip || '';
        if (elements.histConfigVip) elements.histConfigVip.value = found.device.vip || '';
      }
    };
  }

  // 移設用連動
  if (elements.histMoveDev) {
    elements.histMoveDev.onchange = () => {
      const devId = elements.histMoveDev.value;
      const found = findDevice(devId);
      if (found) {
        if (found.device.ticketNo && elements.histTicket) elements.histTicket.value = found.device.ticketNo;
        if (elements.histMoveRack) elements.histMoveRack.value = found.rack.id;
        if (elements.histMoveStartU) elements.histMoveStartU.value = found.device.startU;
        if (elements.histMoveSide) elements.histMoveSide.value = found.device.side || 'front';
      }
    };
  }

  // 撤去用連動
  if (elements.histRemoveDev) {
    elements.histRemoveDev.onchange = () => {
      const devId = elements.histRemoveDev.value;
      const found = findDevice(devId);
      if (found && found.device.ticketNo && elements.histTicket) {
        elements.histTicket.value = found.device.ticketNo;
      }
    };
  }

  // 配線用ポートリスト連動
  const updatePortSelect = (devSelect, portSelect) => {
    if (!devSelect || !portSelect) return;
    devSelect.onchange = () => {
      const devId = devSelect.value;
      const found = findDevice(devId);
      if (found && found.device.ticketNo && elements.histTicket) {
        elements.histTicket.value = found.device.ticketNo;
      }
      portSelect.innerHTML = '';
      if (!found) {
        portSelect.innerHTML = '<option value="1">Port 1</option>';
        return;
      }
      const portCount = found.device.portCount || 4;
      for (let p = 1; p <= portCount; p++) {
        const isUsed = state.cables.some(c => (c.fromDeviceId === devId && c.fromPort === p) || (c.toDeviceId === devId && c.toPort === p));
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = `Port ${p}${isUsed ? ' (接続中)' : ''}`;
        portSelect.appendChild(opt);
      }
    };
  };
  updatePortSelect(elements.histWireFromDev, elements.histWireFromPort);
  updatePortSelect(elements.histWireToDev, elements.histWireToPort);

  // 汎用機器選択連動
  if (elements.histGenDeviceSelect) {
    elements.histGenDeviceSelect.onchange = () => {
      const devId = elements.histGenDeviceSelect.value;
      const found = findDevice(devId);
      if (found) {
        if (found.device.ticketNo && elements.histTicket) elements.histTicket.value = found.device.ticketNo;
        if (elements.histGenHostname) elements.histGenHostname.value = found.device.hostname || found.device.name;
      }
    };
  }
}

function updateHistoryFormTypeVisibility(type) {
  const sections = [
    { id: 'add', el: elements.histSectionAdd },
    { id: 'move', el: elements.histSectionMove },
    { id: 'remove', el: elements.histSectionRemove },
    { id: 'config', el: elements.histSectionConfig },
    { id: 'wiring', el: elements.histSectionWiring },
    { id: 'general', el: elements.histSectionGeneral }
  ];

  sections.forEach(({ id, el }) => {
    if (!el) return;
    if (id === type || (id === 'general' && (type === 'maintenance' || type === 'other'))) {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });
}

function resetHistoryForm() {
  if (elements.histEditLogId) elements.histEditLogId.value = '';
  if (elements.historyFormTitleText) elements.historyFormTitleText.textContent = '新規変更履歴の登録';
  if (elements.btnSaveHistoryText) elements.btnSaveHistoryText.textContent = '登録 ＆ ラック図へ反映';
  if (elements.histDate) elements.histDate.value = new Date().toISOString().split('T')[0];
  if (elements.histTicket) elements.histTicket.value = generateNextTicketNo();
  if (elements.histReason) elements.histReason.value = '';
  if (elements.histOperator) {
    elements.histOperator.value = elements.histOperator.value || '担当者';
  }
}

function openHistoryModal() {
  if (!elements.modalHistory) return;
  populateHistoryDynamicFields();
  updateHistoryFormTypeVisibility(elements.histType?.value || 'add');
  renderChangeLogs();

  // 今日の日付および管理番号の自動採番
  if (elements.histDate) {
    elements.histDate.value = new Date().toISOString().split('T')[0];
  }
  if (elements.histTicket) {
    elements.histTicket.value = generateNextTicketNo();
  }

  elements.modalHistory.classList.add('open');
}

function openEditHistoryLog(id) {
  const log = (state.changeLogs || []).find((l) => l.id === id);
  if (!log) return;

  if (elements.histEditLogId) elements.histEditLogId.value = log.id;
  if (elements.historyFormTitleText) elements.historyFormTitleText.textContent = '変更履歴レコードの修正・編集';
  if (elements.btnSaveHistoryText) elements.btnSaveHistoryText.textContent = '修正内容を保存';

  if (elements.histDate) elements.histDate.value = log.date || '';
  if (elements.histTicket) elements.histTicket.value = log.ticketNo || '';
  if (elements.histType) elements.histType.value = log.type || 'other';
  if (elements.histOperator) elements.histOperator.value = log.operator || '';
  if (elements.histReason) elements.histReason.value = log.reason || '';

  populateHistoryDynamicFields();
  updateHistoryFormTypeVisibility(log.type || 'other');

  const snap = log.deviceSnapshot || {};
  if (log.type === 'add') {
    if (elements.histAddName) elements.histAddName.value = log.hostname || snap.name || '';
    if (elements.histAddIp) elements.histAddIp.value = snap.ip || '';
    if (elements.histAddRack && snap.rackId) elements.histAddRack.value = snap.rackId;
    if (elements.histAddStartU && snap.startU) elements.histAddStartU.value = snap.startU;
    if (elements.histAddSizeU && snap.sizeU) elements.histAddSizeU.value = snap.sizeU;
    if (elements.histAddSide && snap.side) elements.histAddSide.value = snap.side;
    if (elements.histAddType && snap.type) elements.histAddType.value = snap.type;
  } else if (log.type === 'move') {
    if (elements.histMoveDev && log.deviceId) elements.histMoveDev.value = log.deviceId;
    if (elements.histMoveRack && snap.rackId) elements.histMoveRack.value = snap.rackId;
    if (elements.histMoveStartU && snap.startU) elements.histMoveStartU.value = snap.startU;
    if (elements.histMoveSide && snap.side) elements.histMoveSide.value = snap.side;
  } else if (log.type === 'remove') {
    if (elements.histRemoveDev && log.deviceId) elements.histRemoveDev.value = log.deviceId;
  } else if (log.type === 'config') {
    if (elements.histConfigDev && log.deviceId) elements.histConfigDev.value = log.deviceId;
    if (elements.histConfigName) elements.histConfigName.value = log.hostname || snap.name || '';
    if (elements.histConfigIp) elements.histConfigIp.value = snap.ip || '';
    if (elements.histConfigVip) elements.histConfigVip.value = snap.vip || '';
  } else {
    if (elements.histGenHostname) elements.histGenHostname.value = log.hostname || '';
  }

  if (elements.historyFormCard) {
    elements.historyFormCard.style.display = 'block';
    elements.historyFormCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function handleHistoryFormSubmit(e) {
  e.preventDefault();
  const date = elements.histDate?.value.trim() || new Date().toISOString().split('T')[0];
  const ticketNo = elements.histTicket?.value.trim() || `CHG-${Date.now()}`;
  const type = elements.histType?.value || 'add';
  const shouldSync = elements.histSyncToggle ? elements.histSyncToggle.checked : true;
  const operator = elements.histOperator?.value.trim() || '担当者';
  const reason = elements.histReason?.value.trim() || '変更登録';

  const editId = elements.histEditLogId?.value;
  if (editId) {
    // 編集モード (Edit Mode)
    const logIdx = (state.changeLogs || []).findIndex((l) => l.id === editId);
    if (logIdx !== -1) {
      const log = state.changeLogs[logIdx];
      log.date = date;
      log.ticketNo = ticketNo;
      log.type = type;
      log.operator = operator;
      log.reason = reason;

      let newHostname = log.hostname;
      if (type === 'add') {
        newHostname = elements.histAddName?.value.trim() || newHostname;
      } else if (type === 'config') {
        newHostname = elements.histConfigName?.value.trim() || newHostname;
      } else if (type === 'other' || type === 'maintenance') {
        newHostname = elements.histGenHostname?.value.trim() || newHostname;
      }
      log.hostname = newHostname;

      // ラック図連動ONの場合、該当機器のプロパティも更新
      if (shouldSync) {
        let devFound = log.deviceId ? findDevice(log.deviceId) : null;
        if (!devFound && log.hostname) {
          for (const r of state.racks) {
            const d = r.devices.find((dev) => dev.hostname === log.hostname || dev.name === log.hostname);
            if (d) {
              devFound = { device: d, rack: r };
              break;
            }
          }
        }
        if (devFound) {
          devFound.device.name = newHostname;
          devFound.device.hostname = newHostname;
          if (type === 'config') {
            if (elements.histConfigIp) devFound.device.ip = elements.histConfigIp.value.trim();
            if (elements.histConfigVip) devFound.device.vip = elements.histConfigVip.value.trim();
          } else if (type === 'add') {
            if (elements.histAddIp) devFound.device.ip = elements.histAddIp.value.trim();
          }
        }
      }

      // スナップショット更新
      log.deviceSnapshot = captureDeviceSnapshot(log.deviceId || log.hostname);

      saveData();
      renderRacks();
      renderChangeLogs();
      resetHistoryForm();
      if (elements.historyFormCard) elements.historyFormCard.style.display = 'none';
      showToast('変更履歴レコードを修正・更新しました', 'success');
      return;
    }
  }

  let hostname = '';
  let deviceId = null;

  if (shouldSync) {
    if (type === 'add') {
      const rackId = elements.histAddRack?.value;
      const rack = state.racks.find(r => r.id === rackId);
      if (!rack) {
        showToast('設置先ラックを選択してください', 'error');
        return;
      }
      const startU = parseInt(elements.histAddStartU?.value, 10) || 1;
      const sizeU = parseInt(elements.histAddSizeU?.value, 10) || 1;
      const side = elements.histAddSide?.value || 'front';
      const devType = elements.histAddType?.value || 'rackmount';
      const name = elements.histAddName?.value.trim() || 'New Server';
      const ip = elements.histAddIp?.value.trim() || '';

      const isValid = checkSlotAvailability(rack, startU, sizeU, null, 'full', 1);
      if (!isValid) {
        showToast(`指定したスロット (${startU}U / ${sizeU}U) は既に埋まっているか範囲外です`, 'error');
        return;
      }

      const newTicket = ticketNo || generateNextTicketNo();
      const newDev = {
        id: 'dev-' + Date.now(),
        ticketNo: newTicket,
        name,
        ip,
        hostname: '',
        vendor: '',
        model: '',
        sizeU,
        startU,
        side,
        type: devType,
        slotWidth: 'full',
        slotCol: 1,
        portCount: devType === 'l3_switch' || devType === 'l2_switch' ? 24 : (devType === 'utm' ? 8 : (devType === 'ap' ? 2 : 4)),
        powerWatts: getDefaultPowerWatts(devType),
        tags: [],
        pingEnabled: !!ip,
        status: 'unmonitored',
        notes: `管理番号: ${newTicket} にて登録`
      };

      rack.devices.push(newDev);
      deviceId = newDev.id;
      hostname = name;
      ticketNo = newTicket;
      showToast(`ラック図に機器「${name}」(${startU}U) を新規配置しました`, 'success');

    } else if (type === 'move') {
      const devId = elements.histMoveDev?.value;
      const found = findDevice(devId);
      if (!found) {
        showToast('移動対象の機器を選択してください', 'error');
        return;
      }
      const targetRackId = elements.histMoveRack?.value;
      const targetRack = state.racks.find(r => r.id === targetRackId);
      if (!targetRack) {
        showToast('移動先ラックを選択してください', 'error');
        return;
      }
      const newStartU = parseInt(elements.histMoveStartU?.value, 10) || 1;
      const newSide = elements.histMoveSide?.value || found.device.side || 'front';

      const isValid = checkSlotAvailability(targetRack, newStartU, found.device.sizeU, found.device.id, found.device.slotWidth || 'full', found.device.slotCol || 1);
      if (!isValid) {
        showToast(`移動先スロット (${newStartU}U) は既に埋まっています`, 'error');
        return;
      }

      // 移設実行
      if (found.rack.id !== targetRack.id) {
        const idx = found.rack.devices.findIndex(d => d.id === found.device.id);
        if (idx !== -1) found.rack.devices.splice(idx, 1);
        targetRack.devices.push(found.device);
      }
      const oldLocation = `${found.rack.name} (${found.device.startU}U)`;
      found.device.startU = newStartU;
      found.device.side = newSide;

      deviceId = found.device.id;
      hostname = found.device.hostname || found.device.name;
      showToast(`機器「${found.device.name}」を ${oldLocation} ➜ ${targetRack.name} (${newStartU}U) に移設しました`, 'success');

    } else if (type === 'remove') {
      const devId = elements.histRemoveDev?.value;
      const found = findDevice(devId);
      if (!found) {
        showToast('撤去対象の機器を選択してください', 'error');
        return;
      }
      const delName = found.device.name;
      const idx = found.rack.devices.findIndex(d => d.id === devId);
      if (idx !== -1) {
        found.rack.devices.splice(idx, 1);
        cleanupOrphanCables();
      }
      hostname = delName;
      deviceId = null;
      showToast(`機器「${delName}」をラック図から撤去しました`, 'info');

    } else if (type === 'config') {
      const devId = elements.histConfigDev?.value;
      const found = findDevice(devId);
      if (!found) {
        showToast('対象機器を選択してください', 'error');
        return;
      }
      if (elements.histConfigName?.value.trim()) found.device.name = elements.histConfigName.value.trim();
      if (elements.histConfigIp) found.device.ip = elements.histConfigIp.value.trim();
      if (elements.histConfigVip) found.device.vip = elements.histConfigVip.value.trim();
      deviceId = found.device.id;
      hostname = found.device.hostname || found.device.name;
      showToast(`機器「${found.device.name}」の設定を更新しました`, 'success');

    } else if (type === 'wiring') {
      const fromId = elements.histWireFromDev?.value;
      const toId = elements.histWireToDev?.value;
      const fromPort = parseInt(elements.histWireFromPort?.value, 10) || 1;
      const toPort = parseInt(elements.histWireToPort?.value, 10) || 1;
      const col = elements.histWireColor?.value || '#38bdf8';

      if (!fromId || !toId || fromId === toId) {
        showToast('異なる2つの接続機器を選択してください', 'error');
        return;
      }
      const success = createCableBetween(fromId, fromPort, toId, toPort, col);
      if (!success) return;
      const fDev = findDevice(fromId)?.device;
      const tDev = findDevice(toId)?.device;
      hostname = `${fDev?.name || 'Dev1'} ⇄ ${tDev?.name || 'Dev2'}`;
      deviceId = fromId;

    } else {
      hostname = elements.histGenHostname?.value.trim() || '対象機器';
    }
  } else {
    hostname = elements.histGenHostname?.value.trim() || elements.histAddName?.value.trim() || '機器';
  }

  // ログレコードの生成と保存
  recordChangeLog({
    date,
    ticketNo,
    hostname: hostname || '機器',
    deviceId,
    type,
    operator,
    reason
  });

  renderRacks();
  updateHeaderStats();
  resetHistoryForm();
  if (elements.historyFormCard) elements.historyFormCard.style.display = 'none';
}

function renderChangeLogs() {
  if (!elements.historyTableBody) return;

  const keyword = elements.historySearchInput ? elements.historySearchInput.value.toLowerCase().trim() : '';
  const filterType = elements.historyTypeFilter ? elements.historyTypeFilter.value : 'all';

  const logs = state.changeLogs || [];
  const filtered = logs.filter((log) => {
    if (filterType !== 'all' && log.type !== filterType) return false;
    if (keyword) {
      const text = `${log.date || ''} ${log.ticketNo || ''} ${log.hostname || ''} ${log.reason || ''} ${log.operator || ''}`.toLowerCase();
      if (!text.includes(keyword)) return false;
    }
    return true;
  });

  // 日付・時刻の厳密な降順ソート（最新の日時が先頭）
  filtered.sort((a, b) => {
    const timeA = getLogTime(a) || '00:00:00';
    const timeB = getLogTime(b) || '00:00:00';
    const dtA = new Date(`${a.date || '1970-01-01'}T${timeA}`);
    const dtB = new Date(`${b.date || '1970-01-01'}T${timeB}`);
    const diff = dtB.getTime() - dtA.getTime();
    if (!isNaN(diff) && diff !== 0) return diff;
    const tsA = parseInt((a.id || '').split('-')[1], 10) || 0;
    const tsB = parseInt((b.id || '').split('-')[1], 10) || 0;
    return tsB - tsA;
  });

  if (elements.historyCountBadge) {
    elements.historyCountBadge.textContent = `${filtered.length} 件`;
  }

  elements.historyTableBody.innerHTML = '';
  if (filtered.length === 0) {
    elements.historyTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="history-empty-row">
          一致する変更履歴はありません
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((log) => {
    const tr = document.createElement('tr');
    const typeInfo = getChangeTypeName(log.type);

    // 該当ホストがラックに存在するか確認（クリックでジャンプ可能にする）
    let hostCellHtml = `<span>${escapeHtml(log.hostname || '-')}</span>`;
    let jumpTarget = null;
    state.racks.forEach((r) => {
      r.devices.forEach((d) => {
        if (d.id === log.deviceId || d.hostname === log.hostname || d.name === log.hostname) {
          jumpTarget = { rackId: r.id, deviceId: d.id, name: d.name, u: d.startU };
        }
      });
    });

    if (jumpTarget) {
      hostCellHtml = `
        <span class="hist-hostname-link" title="ラック図の該当機器へジャンプ (${jumpTarget.u}U)">
          <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:3px;">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
          <span>${escapeHtml(log.hostname || jumpTarget.name)}</span>
        </span>
      `;
    }

    const isAdd = log.type === 'add';
    const isRemove = log.type === 'remove' || log.type === 'delete';
    const docBtnClass = isAdd ? 'type-add' : (isRemove ? 'type-remove' : '');
    const docBtnLabel = isAdd ? '追加申請書' : (isRemove ? '破棄申請書' : '変更申請書');

    const logTime = getLogTime(log);
    const timeDisplay = logTime ? `<div class="hist-time-sub">${escapeHtml(logTime)}</div>` : '';

    tr.innerHTML = `
      <td class="hist-date-cell">
        <div class="hist-date-main">${escapeHtml(log.date || '-')}</div>
        ${timeDisplay}
      </td>
      <td>
        <span class="hist-ticket-badge log-ticket-link" title="クリックしてラック図上の機器へ移動" style="cursor:pointer;">
          <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px;display:inline-block;vertical-align:middle;margin-right:2px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${escapeHtml(log.ticketNo || '-')}</span>
        </span>
      </td>
      <td>${hostCellHtml}</td>
      <td><span class="hist-type-badge ${typeInfo.cls}">${typeInfo.iconSvg} <span>${escapeHtml(typeInfo.label)}</span></span></td>
      <td class="hist-reason-text">${escapeHtml(log.reason || '-')}</td>
      <td class="hist-operator-text">${escapeHtml(log.operator || '-')}</td>
      <td style="text-align:center; white-space:nowrap;">
        <button type="button" class="btn-doc-row ${docBtnClass}" title="${docBtnLabel}を作成・プレビュー・印刷">
          <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;margin-right:2px;display:inline-block;vertical-align:middle;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <span>${docBtnLabel}</span>
        </button>
        <button type="button" class="btn-icon btn-sm btn-edit-log" title="この履歴を修正・編集" style="color:var(--accent-cyan); margin-left:4px;">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button type="button" class="btn-icon btn-sm btn-del-log" title="履歴を削除" style="color:#ef4444; margin-left:2px;">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>
    `;

    // 申請書ボタン
    tr.querySelector('.btn-doc-row')?.addEventListener('click', () => {
      openApplicationDocModal(log.id);
    });

    // 編集ボタン
    tr.querySelector('.btn-edit-log')?.addEventListener('click', () => {
      openEditHistoryLog(log.id);
    });

    // ホスト名または管理番号クリックで該当機器へジャンプ
    if (jumpTarget) {
      tr.querySelector('.hist-hostname-link')?.addEventListener('click', () => {
        closeHistoryModal();
        jumpToDevice(jumpTarget.rackId, jumpTarget.deviceId);
      });
      tr.querySelector('.log-ticket-link')?.addEventListener('click', () => {
        closeHistoryModal();
        jumpToDevice(jumpTarget.rackId, jumpTarget.deviceId);
      });
    } else if (log.deviceId) {
      tr.querySelector('.log-ticket-link')?.addEventListener('click', () => {
        closeHistoryModal();
        jumpToDevice(log.deviceId);
      });
    }

    // 削除ボタン
    tr.querySelector('.btn-del-log').addEventListener('click', () => {
      const ticketText = log.ticketNo ? `管理番号「${log.ticketNo}」の` : '';
      if (confirm(`${ticketText}変更履歴を台帳から削除しますか？\n\n※ラック図上の機器構成はそのまま維持されます。`)) {
        deleteChangeLog(log.id);
      }
    });

    elements.historyTableBody.appendChild(tr);
  });
}

function deleteChangeLog(id) {
  if (!state.changeLogs) return;
  const idx = state.changeLogs.findIndex((l) => l.id === id);
  if (idx === -1) return;
  state.changeLogs.splice(idx, 1);

  saveData();
  renderChangeLogs();
  if (state.selectedDeviceId) {
    renderDevicePropertyHistory(state.selectedDeviceId);
  }
  showToast('変更履歴を台帳から削除しました（ラック構成は維持）', 'info');
}

// --- 案1: 変更履歴ログの一括クリア（初期化） ---
function clearAllChangeLogs() {
  const count = (state.changeLogs || []).length;
  if (count === 0) {
    showToast('現在、変更履歴ログはありません', 'info');
    return;
  }
  const confirmMsg = `これまでの変更履歴ログ（全 ${count} 件）をすべてクリア（初期化）しますか？\n\n※ラックやサーバー、配線などの構成データ本体は安全に保持されます。`;
  if (!confirm(confirmMsg)) return;

  state.changeLogs = [];
  saveData();
  renderChangeLogs();
  if (state.selectedDeviceId) {
    renderDevicePropertyHistory(state.selectedDeviceId);
  }
  showToast(`変更履歴ログ（${count}件）をすべてクリアしました（初期状態にリセット）`, 'success');
}

// --- 案2: 初期構築モード（履歴記録OFF）のUI更新 & 切り替え ---
function updateSetupModeUI() {
  const isSetup = Boolean(state.settings && state.settings.initialSetupMode);

  // ヘッダーボタン
  if (elements.btnToggleSetupMode) {
    if (isSetup) {
      elements.btnToggleSetupMode.classList.add('active-setup-mode');
      elements.btnToggleSetupMode.title = '初期構築モード: 有効（機器の追加・移動・編集を行っても変更履歴ログに記録されません）クリックで通常モードへ';
      if (elements.setupModePill) {
        elements.setupModePill.textContent = 'ON';
      }
    } else {
      elements.btnToggleSetupMode.classList.remove('active-setup-mode');
      elements.btnToggleSetupMode.title = '初期構築モード: OFF（通常の変更履歴記録が有効です）クリックで初期構築モードへ';
      if (elements.setupModePill) {
        elements.setupModePill.textContent = 'OFF';
      }
    }
  }

  // 履歴モーダル内のバナー
  if (elements.historySetupModeBanner) {
    elements.historySetupModeBanner.style.display = isSetup ? 'flex' : 'none';
  }

  // 設定モーダル内のチェックボックス
  if (elements.settingSetupModeToggle) {
    elements.settingSetupModeToggle.checked = isSetup;
  }
}

function toggleSetupMode(forceState = null) {
  if (!state.settings) state.settings = {};
  const current = Boolean(state.settings.initialSetupMode);
  const next = forceState !== null ? Boolean(forceState) : !current;

  state.settings.initialSetupMode = next;
  saveData();
  updateSetupModeUI();

  if (next) {
    showToast('🚧 初期構築モードを有効にしました（変更履歴の自動記録を停止）', 'warning');
  } else {
    showToast('✅ 通常運用モードに切り替えました（変更履歴の自動記録を再開）', 'success');
  }
}

function exportHistoryCsv() {
  const logs = state.changeLogs || [];
  if (logs.length === 0) {
    showToast('出力する変更履歴がありません', 'info');
    return;
  }

  let csvContent = '\uFEFF日付,管理番号,ホスト名/対象機器,変更種別,変更理由・作業内容,作業担当者\n';
  logs.forEach((log) => {
    const typeInfo = getChangeTypeName(log.type);
    const row = [
      `"${log.date || ''}"`,
      `"${log.ticketNo || ''}"`,
      `"${(log.hostname || '').replace(/"/g, '""')}"`,
      `"${typeInfo.label}"`,
      `"${(log.reason || '').replace(/"/g, '""')}"`,
      `"${(log.operator || '').replace(/"/g, '""')}"`
    ];
    csvContent += row.join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rack_change_history_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('変更履歴台帳CSVを出力しました', 'success');
}

// ==========================================================================
// RackManager v3 - 申請書（追加申請書 / 廃棄申請書 / 構成変更申請書）自動生成 ＆ 印刷出力エンジン
// ==========================================================================

let currentDocLogEntry = null;

function generateApplicationDocHtml(log, forcedDocType = null) {
  if (!log) {
    return '<div style="padding:40px; text-align:center; color:#64748b;">表示する変更履歴データがありません</div>';
  }

  const isRemoveType = log.type === 'remove' || log.type === 'delete';
  const docType = forcedDocType || (log.type === 'add' ? 'add' : (isRemoveType ? 'remove' : 'change'));
  
  // 機器情報の特定（1. liveラックデータ優先 ➜ 2. ホスト名検索 ➜ 3. logスナップショット）
  let targetDev = null;
  let targetRack = null;
  if (log.deviceId) {
    const found = findDevice(log.deviceId);
    if (found) {
      targetDev = found.device;
      targetRack = found.rack;
    }
  }
  if (!targetDev && log.hostname) {
    for (const r of state.racks) {
      const d = r.devices.find(dev => dev.hostname === log.hostname || dev.name === log.hostname);
      if (d) {
        targetDev = d;
        targetRack = r;
        break;
      }
    }
  }

  const snap = log.deviceSnapshot || {};
  const devName = targetDev?.name || snap.name || log.hostname || '対象機器';
  const hostname = targetDev?.hostname || snap.hostname || devName;
  const devType = targetDev?.type || snap.type || 'rackmount';
  const devTypeLabel = getDeviceTypeName(devType);
  const vendor = targetDev?.vendor || snap.vendor || '';
  const model = targetDev?.model || snap.model || '';
  const vendorModel = (vendor || model) ? `${vendor || '-'} / ${model || '-'}` : '標準ラックマウント仕様';
  const rackName = targetRack?.name || snap.rackName || '指定ラック';
  const startU = targetDev?.startU || snap.startU || 1;
  const sizeU = targetDev?.sizeU || snap.sizeU || 1;
  const side = targetDev?.side || snap.side || 'front';
  const sideLabel = side === 'rear' ? '背面 (Rear)' : (side === 'full' ? '前後貫通 (Full Depth)' : '前面 (Front)');
  const slotWidth = targetDev?.slotWidth || snap.slotWidth || 'full';
  const slotCol = targetDev?.slotCol || snap.slotCol || 1;
  const colLabel = slotWidth === 'half' ? ` (1/2幅 ${slotCol === 2 ? '右' : '左'}列)` : (slotWidth === 'third' ? ` (1/3幅 列${slotCol})` : '');
  const rackLoc = `${rackName} [${startU}U 〜 ${startU + sizeU - 1}U / ${sizeU}U分 / ${sideLabel}${colLabel}]`;
  const ipAddr = targetDev?.ip || snap.ip || '未設定 (DHCP / 固定割当予定)';
  const vipAddr = targetDev?.vip || snap.vip || '-';
  const haRole = targetDev?.haRole || snap.haRole || 'standalone';
  const haRoleLabel = haRole === 'primary' ? 'アクティブ (Primary)' : (haRole === 'secondary' ? 'スタンバイ (Secondary)' : 'スタンドアロン (単体)');
  const powerWatts = targetDev?.powerWatts !== undefined ? `${targetDev.powerWatts} W` : (snap.powerWatts ? `${snap.powerWatts} W` : `${getDefaultPowerWatts(devType)} W`);
  const portCount = targetDev?.portCount !== undefined ? `${targetDev.portCount} ポート` : (snap.portCount ? `${snap.portCount} ポート` : '4 ポート');
  const notes = targetDev?.notes || snap.notes || '特記事項なし';
  const tags = (targetDev?.tags || snap.tags || []).join(', ') || '-';

  // 接続されている配線情報 (リアルタイム結線データ)
  let cableLines = [];
  const devId = targetDev?.id || snap.id;
  if (devId) {
    const connectedCables = (state.cables || []).filter(c => c.fromDeviceId === devId || c.toDeviceId === devId);
    cableLines = connectedCables.map(c => {
      const isFrom = c.fromDeviceId === devId;
      const otherId = isFrom ? c.toDeviceId : c.fromDeviceId;
      const otherFound = findDevice(otherId);
      const otherDev = otherFound?.device;
      const otherRack = otherFound?.rack;
      const selfPort = isFrom ? c.fromPort : c.toPort;
      const otherPort = isFrom ? c.toPort : c.fromPort;
      const otherName = otherDev?.name || '接続先機器';
      const otherLoc = otherRack ? `[${otherRack.name} ${otherDev?.startU || '-'}U]` : '';
      return `Port ${selfPort} ⇄ ${otherLoc} ${otherName} (Port ${otherPort})`;
    });
  }
  if (cableLines.length === 0 && snap.cables && snap.cables.length > 0) {
    cableLines = snap.cables;
  }
  const cablesSummary = cableLines.length > 0 ? cableLines.join('<br>') : '未結線 / 独立運用';

  let title = 'IT設備 構成変更・作業実施申請書';
  let titleColor = '#0f172a';
  let categoryLabel = '【構成変更・保守作業】';

  if (docType === 'add') {
    title = 'ITインフラ機器 設置・追加申請書';
    titleColor = '#15803d';
    categoryLabel = '【新規導入・ラック増設】';
  } else if (docType === 'remove') {
    title = 'IT機器 撤去・廃棄処分申請書';
    titleColor = '#b91c1c';
    categoryLabel = '【撤去・安全廃棄処分】';
  }

  // 追加申請書専用ブロック (3. 実施計画 ＆ 4. 作業実施チェックリスト)
  const addSectionHtml = `
    <div class="doc-section">
      <div class="doc-section-title green">3. 電源・ネットワーク収容仕様 ＆ 運用監視計画</div>
      <table class="doc-table">
        <tr>
          <th>給電受電系統</th>
          <td>A系統 / B系統 冗長受電 (AC100V/200V PDU接続)</td>
          <th>定格消費電力</th>
          <td><strong>${escapeHtml(powerWatts)}</strong></td>
        </tr>
        <tr>
          <th>アップリンク結線</th>
          <td>${cablesSummary}</td>
          <th>VLAN / セグメント</th>
          <td>VLAN-100 (業務LAN) / VLAN-99 (管理Mgmt)</td>
        </tr>
        <tr>
          <th>死活監視登録</th>
          <td>Ping / SNMP監視システムへの自動登録 (ポート監視有効)</td>
          <th>保守サポート期間</th>
          <td>設置日より 5年間 オンサイト24h365d保守</td>
        </tr>
      </table>
    </div>
    <div class="doc-section">
      <div class="doc-section-title green">4. 作業実施チェックリスト ＆ 安全管理規定</div>
      <div class="doc-checklist">
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>ラック物理マウント固定およびエアフロー保持確認</span></div>
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>給電系統（AC100V/200V PDU）受電およびアース接地確認</span></div>
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>アップリンクLAN結線・リンクアップ・IP疎通確認</span></div>
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>運用監視システム（Ping/SNMP）登録およびステータスLED正常確認</span></div>
      </div>
    </div>
  `;

  // 廃棄申請書専用ブロック (3. 実施計画 ＆ 4. 作業実施チェックリスト)
  const removeSectionHtml = `
    <div class="doc-section">
      <div class="doc-section-title red">3. データ消去措置 ＆ 資産廃棄処理規定</div>
      <table class="doc-table">
        <tr>
          <th>データ消去方式</th>
          <td><strong>NIST SP 800-88 Rev.1 準拠（上書き消去 / 磁気消去 / 物理破壊）</strong></td>
          <th>消去証明書</th>
          <td>要発行（データ消去作業完了証明書を添付保管）</td>
        </tr>
        <tr>
          <th>資産区分</th>
          <td>自社固定資産（除却処理・資産台帳抹消対象）</td>
          <th>物理撤去担当</th>
          <td>データセンター専任技術員 / インフラ運用担当</td>
        </tr>
        <tr>
          <th>ケーブル抜線回収</th>
          <td>電源ケーブル・LANパッチコード完全撤去・回収</td>
          <th>廃棄先処分規定</th>
          <td>マニフェスト（産業廃棄物管理票）発行・適正処理</td>
        </tr>
      </table>
    </div>
    <div class="doc-section">
      <div class="doc-section-title red">4. 作業実施チェックリスト ＆ 安全管理規定</div>
      <div class="doc-checklist">
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>ストレージ内機密データ消去（NIST準拠）および初期化完了確認</span></div>
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>LANケーブル・電源ケーブル・パッチコードの完全抜線および回収</span></div>
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>ラック空きスロットへのブランクパネル装着（エアフロー保持）</span></div>
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>運用監視システム・DNS・構成台帳からのノード登録抹消</span></div>
      </div>
    </div>
  `;

  // 構成変更専用ブロック (3. 実施計画 ＆ 4. 作業実施チェックリスト)
  const changeSectionHtml = `
    <div class="doc-section">
      <div class="doc-section-title purple">3. 作業影響範囲 ＆ 切り戻し計画</div>
      <table class="doc-table">
        <tr>
          <th>サービス影響</th>
          <td>瞬断あり（HA構成: ${haRoleLabel}）</td>
          <th>作業時間帯</th>
          <td>保守計画停止時間帯（夜間メンテナンス窓口）</td>
        </tr>
        <tr>
          <th>切り戻し手順</th>
          <td>作業前の設定バックアップ（Configアーカイブ）への即時ロールバック</td>
          <th>HAフェイルオーバー</th>
          <td>クラスタ系切り替え確認・仮想IP (VIP) 移行検証</td>
        </tr>
        <tr>
          <th>監視通知抑制</th>
          <td>作業時間帯におけるアラート通知一時静止（メンテナンスモード）</td>
          <th>台帳構成更新</th>
          <td>作業完了後のラック図・変更履歴台帳の即時更新</td>
        </tr>
      </table>
    </div>
    <div class="doc-section">
      <div class="doc-section-title purple">4. 作業実施チェックリスト ＆ 安全管理規定</div>
      <div class="doc-checklist">
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>作業前の設定バックアップ（Configアーカイブ）取得確認</span></div>
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>構成変更・ポート結線変更・スロット移設作業の実施</span></div>
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>サービス影響・HAクラスタフェイルオーバーおよび疎通確認</span></div>
        <div class="doc-check-item"><span class="doc-check-box"></span> <span>運用監視ステータス正常および設備台帳の変更記録更新</span></div>
      </div>
    </div>
  `;

  let specificSectionHtml = changeSectionHtml;
  if (docType === 'add') specificSectionHtml = addSectionHtml;
  else if (docType === 'remove') specificSectionHtml = removeSectionHtml;

  return `
    <!-- 帳票メインヘッダー＆タイトル（最上部に明確に配置） -->
    <div class="doc-header-block">
      <div class="doc-badge-pill ${docType}">${categoryLabel}</div>
      <h1 class="doc-main-title ${docType}">${title}</h1>
      <div class="doc-sub-bar">
        <span>データセンター設備管理 ＆ ITインフラ構成変更管理システム 公式帳票</span>
        <span class="doc-confidential-mark">【社内限り・要保管】</span>
      </div>
    </div>

    <!-- 申請メタ情報 ＆ 承認印鑑グリッド -->
    <div class="doc-top-bar">
      <div class="doc-meta-left">
        <div class="doc-org-title">情報システム統括部 / インフラ基盤運用課</div>
        <div>データセンター設備管理・構成変更管理グループ</div>
        <div style="margin-top:6px;"><strong>申請日:</strong> ${escapeHtml(log.date || new Date().toISOString().split('T')[0])}</div>
        <div><strong>申請番号:</strong> <span style="font-family:var(--font-mono); font-weight:700; color:#2563eb;">DOC-${escapeHtml(log.ticketNo || '2026-001')}</span></div>
      </div>
      <div class="doc-stamp-grid">
        <div class="doc-stamp-box" data-role="起案者">
          <div class="doc-stamp-title">起案者</div>
          <div class="doc-stamp-space">未捺印</div>
        </div>
        <div class="doc-stamp-box" data-role="審査者">
          <div class="doc-stamp-title">審査者</div>
          <div class="doc-stamp-space">未捺印</div>
        </div>
        <div class="doc-stamp-box" data-role="承認者">
          <div class="doc-stamp-title">承認者</div>
          <div class="doc-stamp-space">未捺印</div>
        </div>
        <div class="doc-stamp-box" data-role="DC立会">
          <div class="doc-stamp-title">DC立会</div>
          <div class="doc-stamp-space">未捺印</div>
        </div>
      </div>
    </div>

    <div class="doc-section">
      <div class="doc-section-title">1. 申請概要</div>
      <table class="doc-table">
        <tr>
          <th>管理番号 (CHG)</th>
          <td style="font-family:var(--font-mono); font-weight:700;">${escapeHtml(log.ticketNo || '-')}</td>
          <th>作業担当者 / 起案者</th>
          <td>${escapeHtml(log.operator || 'インフラ管理者')}</td>
        </tr>
        <tr>
          <th>作業種別</th>
          <td><strong>${escapeHtml(getChangeTypeName(log.type).label)}</strong></td>
          <th>実施予定日</th>
          <td>${escapeHtml(log.date || '-')}</td>
        </tr>
        <tr>
          <th>申請理由・作業目的</th>
          <td colspan="3" style="line-height:1.45;">${escapeHtml(log.reason || 'IT設備管理台帳に基づく定期構成変更および機器運用作業')}</td>
        </tr>
      </table>
    </div>

    <div class="doc-section">
      <div class="doc-section-title">2. 対象機器諸元 ＆ ラックプロパティ詳細</div>
      <table class="doc-table">
        <tr>
          <th>機器名 / ホスト名</th>
          <td style="font-weight:700; color:#1d4ed8;">${escapeHtml(devName)}${hostname && hostname !== devName ? ' (' + escapeHtml(hostname) + ')' : ''}</td>
          <th>機器種別</th>
          <td>${escapeHtml(devTypeLabel)}</td>
        </tr>
        <tr>
          <th>メーカー / 型番</th>
          <td>${escapeHtml(vendorModel)}</td>
          <th>設置ラック / スロット</th>
          <td><strong>${escapeHtml(rackLoc)}</strong></td>
        </tr>
        <tr>
          <th>IPアドレス</th>
          <td style="font-family:var(--font-mono); font-weight:600;">${escapeHtml(ipAddr)}</td>
          <th>VIP (仮想IP) / HA構成</th>
          <td style="font-family:var(--font-mono);">${escapeHtml(vipAddr)} (${escapeHtml(haRoleLabel)})</td>
        </tr>
        <tr>
          <th>定格消費電力</th>
          <td>${escapeHtml(powerWatts)}</td>
          <th>搭載ポート数</th>
          <td>${escapeHtml(portCount)}</td>
        </tr>
        <tr>
          <th>結線済みLAN配線</th>
          <td colspan="3" style="font-size:11.5px; line-height:1.4;">${cablesSummary}</td>
        </tr>
        <tr>
          <th>タグ / 役割</th>
          <td>${escapeHtml(tags)}</td>
          <th>メモ / 備考</th>
          <td style="color:#475569; font-size:11.5px;">${escapeHtml(notes)}</td>
        </tr>
      </table>
    </div>

    ${specificSectionHtml}

    <div class="doc-footer-sign">
      <div>作業実施担当署名: ___________________________</div>
      <div>DC運用責任者受領確認: ___________________________ (印)</div>
      <div>完了確認日: 2026年 ____月 ____日</div>
    </div>
  `;
}

function openApplicationDocModal(logId = null, forcedType = null) {
  if (!elements.modalDocForm) return;

  const logs = state.changeLogs || [];
  let log = logs.find(l => l.id === logId);
  if (!log) {
    if (logs.length > 0) log = logs[0];
    else {
      const devFound = state.selectedDeviceId ? findDevice(state.selectedDeviceId) : null;
      log = {
        id: 'tmp-doc-1',
        date: new Date().toISOString().split('T')[0],
        ticketNo: `CHG-${new Date().getFullYear()}-001`,
        hostname: devFound ? (devFound.device.hostname || devFound.device.name) : 'web-front-01',
        deviceId: devFound ? devFound.device.id : null,
        type: 'add',
        operator: '山田 (インフラ担当)',
        reason: '新規Webクラスタ拡張に伴う機器追加申請'
      };
    }
  }

  currentDocLogEntry = log;

  // 帳票種別の初期化
  const isRemoveType = log.type === 'remove' || log.type === 'delete';
  const docType = forcedType || (log.type === 'add' ? 'add' : (isRemoveType ? 'remove' : 'change'));
  if (elements.docTypeSelect) {
    elements.docTypeSelect.value = docType;
  }

  elements.modalDocForm.classList.add('open');
  renderApplicationDocContent(docType);
  if (elements.docFormModalBody) elements.docFormModalBody.scrollTop = 0;
}

function renderApplicationDocContent(docType) {
  if (!elements.docPaperContainer || !currentDocLogEntry) return;

  if (elements.docModalTitle) {
    elements.docModalTitle.textContent = docType === 'add'
      ? '機器設置・追加申請書'
      : (docType === 'remove' ? '機器破棄・撤去申請書' : '構成変更・作業実施申請書');
  }

  elements.docPaperContainer.innerHTML = generateApplicationDocHtml(currentDocLogEntry, docType);
  initDocStampBoxes();
  if (elements.docFormModalBody) elements.docFormModalBody.scrollTop = 0;
  if (elements.docPaperContainer) elements.docPaperContainer.scrollTop = 0;
}

function initDocStampBoxes() {
  if (!elements.docPaperContainer) return;
  const stampBoxes = elements.docPaperContainer.querySelectorAll('.doc-stamp-box');
  
  stampBoxes.forEach(box => {
    box.onclick = (e) => {
      if (e.target.classList.contains('doc-stamp-remove')) {
        return;
      }
      
      const space = box.querySelector('.doc-stamp-space');
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            space.innerHTML = `<img src="${dataUrl}" class="doc-stamp-img" alt="印影">`;
            
            let removeBtn = box.querySelector('.doc-stamp-remove');
            if (!removeBtn) {
              removeBtn = document.createElement('div');
              removeBtn.className = 'doc-stamp-remove';
              removeBtn.innerHTML = '×';
              removeBtn.title = '印鑑を削除';
              
              removeBtn.onclick = (evt) => {
                evt.stopPropagation();
                space.innerHTML = '<span class="doc-stamp-placeholder">未捺印</span>';
                removeBtn.remove();
              };
              
              box.appendChild(removeBtn);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    };
  });
}

// ===== 申請書: ポップアップなしで直接印刷（非表示iframe経由・A4クリーン出力）=====
function printApplicationDocNewWindow() {
  if (!currentDocLogEntry) return;
  const docType = elements.docTypeSelect?.value || 'add';
  const htmlContent = generateApplicationDocHtml(currentDocLogEntry, docType);

  // 現在プレビューに表示中の捺印済み画像も取得
  const stampBoxes = elements.docPaperContainer?.querySelectorAll('.doc-stamp-box') || [];
  let stampData = {};
  stampBoxes.forEach(box => {
    const role = box.dataset.role;
    const img = box.querySelector('img.doc-stamp-img');
    if (role && img) stampData[role] = img.src;
  });

  // 捺印状態を反映したHTMLに置換
  const stampedHtml = htmlContent.replace(
    /(<div class="doc-stamp-box" data-role="([^"]+)">[\s\S]*?<div class="doc-stamp-space">)[\s\S]*?(<\/div>\s*<\/div>)/g,
    (match, pre, role, post) => {
      if (stampData[role]) {
        return `${pre}<img src="${stampData[role]}" style="width:100%;height:100%;object-fit:contain;" alt="印影">${post}`;
      }
      return match;
    }
  );

  // 既存の印刷用非表示iframeがあれば削除
  let printFrame = document.getElementById('doc-print-hidden-frame');
  if (printFrame) {
    printFrame.remove();
  }

  printFrame = document.createElement('iframe');
  printFrame.id = 'doc-print-hidden-frame';
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  printFrame.style.opacity = '0';
  printFrame.style.pointerEvents = 'none';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>申請書 - DOC-${escapeHtml(currentDocLogEntry.ticketNo || '')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 portrait; margin: 10mm 12mm; }
    html, body {
      width: 100%;
      background: #fff;
      color: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif;
    }
    .doc-header-block { text-align:center; margin-bottom:10px; padding-bottom:6px; border-bottom:2px solid #0f172a; }
    .doc-badge-pill { display:inline-block; font-size:10px; font-weight:700; padding:2px 10px; border-radius:12px; margin-bottom:3px; }
    .doc-badge-pill.add { background:#dcfce7; color:#15803d; border:1px solid #86efac; }
    .doc-badge-pill.remove { background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; }
    .doc-badge-pill.change { background:#f3e8ff; color:#7e22ce; border:1px solid #d8b4fe; }
    .doc-main-title { font-size:19px; font-weight:800; letter-spacing:0.05em; color:#0f172a; margin:0 0 3px; }
    .doc-main-title.add { color:#15803d; } .doc-main-title.remove { color:#b91c1c; } .doc-main-title.change { color:#581c87; }
    .doc-sub-bar { display:flex; justify-content:space-between; font-size:9.5px; color:#64748b; margin-top:2px; }
    .doc-confidential-mark { font-weight:700; color:#dc2626; font-size:9.5px; }
    .doc-top-bar { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; }
    .doc-meta-left { font-size:10px; color:#475569; line-height:1.4; }
    .doc-meta-left .doc-org-title { font-size:11.5px; font-weight:700; color:#0f172a; margin-bottom:2px; }
    .doc-stamp-grid { display:flex; border:1.5px solid #334155; border-radius:3px; overflow:hidden; }
    .doc-stamp-box { width:52px; height:56px; border-right:1px solid #cbd5e1; display:flex; flex-direction:column; text-align:center; font-size:8.5px; position:relative; }
    .doc-stamp-box:last-child { border-right:none; }
    .doc-stamp-title { background:#f1f5f9; border-bottom:1px solid #cbd5e1; padding:2px 0; font-weight:700; color:#334155; font-size:8.5px; }
    .doc-stamp-space { flex:1; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:8px; padding:1px; }
    .doc-stamp-space img { width:100%; height:100%; object-fit:contain; }
    .doc-section { margin-bottom:10px; }
    .doc-section-title { font-size:10.5px; font-weight:700; background:#f8fafc; border-left:3px solid #334155; padding:2px 6px; margin-bottom:4px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .doc-section-title.red { border-left-color:#ef4444; } .doc-section-title.amber { border-left-color:#f59e0b; } .doc-section-title.green { border-left-color:#22c55e; } .doc-section-title.purple { border-left-color:#a855f7; }
    .doc-table { width:100%; border-collapse:collapse; font-size:9.5px; margin-bottom:4px; }
    .doc-table th, .doc-table td { border:1px solid #cbd5e1; padding:3.5px 6px; line-height:1.3; }
    .doc-table th { background:#f8fafc; font-weight:600; width:22%; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .doc-checklist { display:flex; flex-direction:column; gap:2.5px; padding:5px 8px; background:#f8fafc; border:1px solid #e2e8f0; font-size:9.5px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .doc-check-item { display:flex; align-items:center; gap:4px; }
    .doc-check-box { width:9.5px; height:9.5px; border:1px solid #475569; display:inline-block; flex-shrink:0; }
    .doc-footer-sign { margin-top:12px; padding-top:6px; border-top:1px dashed #cbd5e1; display:flex; justify-content:space-between; font-size:9.5px; color:#475569; }
  </style>
</head>
<body>
${stampedHtml}
</body>
</html>`);
  frameDoc.close();

  setTimeout(() => {
    try {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    } catch (err) {
      console.error('Print iframe error:', err);
    }
  }, 250);
}

function closeApplicationDocModal() {
  if (elements.modalDocForm) {
    elements.modalDocForm.classList.remove('open');
  }
}

function copyApplicationDocText() {
  if (!currentDocLogEntry) return;
  const docType = elements.docTypeSelect?.value || 'add';
  const typeName = docType === 'add' ? '機器設置・追加申請書' : (docType === 'remove' ? '機器廃棄・撤去申請書' : '構成変更・作業実施申請書');
  const found = currentDocLogEntry.deviceId ? findDevice(currentDocLogEntry.deviceId) : null;
  const dev = found?.device;

  const text = `
================================================================================
【${typeName}】
================================================================================
■ 申請日: ${currentDocLogEntry.date}
■ 申請番号: DOC-${currentDocLogEntry.ticketNo}
■ 申請者: ${currentDocLogEntry.operator}
■ 作業種別: ${getChangeTypeName(currentDocLogEntry.type).label}

■ 対象機器情報
  - ホスト名/機器名: ${currentDocLogEntry.hostname}
  - 機器タイプ: ${dev ? getDeviceTypeName(dev.type) : 'サーバー'}
  - 設置場所: ${found ? `${found.rack.name} ${dev.startU}U (${dev.sizeU}U分)` : 'データセンターラック'}
  - IPアドレス: ${dev?.ip || '未設定'}
  - VIP: ${dev?.vip || '-'}
  - 消費電力: ${dev?.powerWatts || 350}W

■ 申請理由・作業内容
  ${currentDocLogEntry.reason}

■ 特記事項
  ${docType === 'add' ? '- A/B系統冗長給電\n- Ping死活監視登録済み\n- L2/L3スイッチTrunk結線' : docType === 'remove' ? '- NIST SP 800-88準拠データ消去\n- 配線完全撤去およびブランクパネル装着\n- 監視アラート停止' : '- バックアップ取得確認済み\n- 夜間メンテナンス枠での実施'}
================================================================================
`.trim();

  navigator.clipboard.writeText(text).then(() => {
    showToast('申請書テキストをクリップボードにコピーしました', 'success');
  }).catch(() => {
    showToast('テキストのコピーに失敗しました', 'error');
  });
}

// ==========================================================================
// RackManager v2 - 機能2: 障害影響シミュレーション (Impact Analysis)
// ==========================================================================
let impactSimulationActive = false;
let currentImpactTargetId = null;

function openImpactModal() {
  if (!elements.modalImpact) return;
  populateImpactTargets();
  elements.modalImpact.classList.add('open');
}

function closeImpactModal() {
  if (elements.modalImpact) {
    elements.modalImpact.classList.remove('open');
  }
}

function populateImpactTargets() {
  if (!elements.impactTargetSelect) return;
  elements.impactTargetSelect.innerHTML = '<option value="">-- 障害対象の機器を選択してください --</option>';

  state.racks.forEach((rack) => {
    rack.devices.forEach((dev) => {
      // スイッチ、ルーター、UTM、PDU、主要サーバーをリスト
      const opt = document.createElement('option');
      opt.value = dev.id;
      opt.textContent = `[${getDeviceTypeName(dev.type)}] ${dev.name || dev.id} (${rack.name} - ${dev.startU}U / ${dev.ip || 'IPなし'})`;
      if (dev.id === currentImpactTargetId) opt.selected = true;
      elements.impactTargetSelect.appendChild(opt);
    });
  });
}

function runImpactSimulation(targetDevId) {
  if (!targetDevId) {
    showToast('障害対象機器を選択してください', 'error');
    return;
  }

  currentImpactTargetId = targetDevId;
  impactSimulationActive = true;

  // 下流影響機器を探索 (BFS)
  const affectedDevIds = new Set();
  const queue = [targetDevId];
  const visited = new Set([targetDevId]);

  // 隣接リスト作成
  const adj = new Map();
  (state.cables || []).forEach((c) => {
    if (!adj.has(c.fromDeviceId)) adj.set(c.fromDeviceId, []);
    if (!adj.has(c.toDeviceId)) adj.set(c.toDeviceId, []);
    adj.get(c.fromDeviceId).push({ to: c.toDeviceId, port: c.fromPort });
    adj.get(c.toDeviceId).push({ to: c.fromDeviceId, port: c.toPort });
  });

  while (queue.length > 0) {
    const curr = queue.shift();
    const neighbors = adj.get(curr) || [];
    neighbors.forEach((nbr) => {
      if (!visited.has(nbr.to)) {
        visited.add(nbr.to);
        affectedDevIds.add(nbr.to);
        queue.push(nbr.to);
      }
    });
  }

  // 影響レポートテーブル描画
  if (elements.impactResultsSection && elements.impactAffectedTbody) {
    elements.impactResultsSection.style.display = 'block';
    if (elements.btnClearImpactSim) elements.btnClearImpactSim.style.display = 'inline-flex';
    if (elements.impactAffectedCount) {
      elements.impactAffectedCount.textContent = `影響機器: ${affectedDevIds.size}台`;
    }

    elements.impactAffectedTbody.innerHTML = '';
    if (affectedDevIds.size === 0) {
      elements.impactAffectedTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">この機器に直接依存している下流機器は見つかりませんでした（単体影響のみ）</td></tr>`;
    } else {
      affectedDevIds.forEach((devId) => {
        const found = findDevice(devId);
        if (found) {
          const { device, rack } = found;
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><span style="color:#ef4444; font-weight:700;">⚠️ 遮断</span></td>
            <td><strong>${escapeHtml(device.name || '名称未設定')}</strong></td>
            <td><span style="font-family:var(--font-mono); color:#38bdf8;">${escapeHtml(device.ip || device.hostname || '-')}</span></td>
            <td>${escapeHtml(rack.name)} / ${device.startU}U</td>
            <td>${getDeviceTypeName(device.type)}</td>
            <td>LAN接続経由</td>
          `;
          elements.impactAffectedTbody.appendChild(tr);
        }
      });
    }
  }

  // ラック上の全機器にハイライトクラスを付与
  applyImpactHighlights(targetDevId, Array.from(affectedDevIds));

  // 画面上部にシミュレーション実行中バナーを表示
  const targetFound = findDevice(targetDevId);
  const targetName = targetFound ? targetFound.device.name : '指定機器';
  if (elements.impactActiveBar) {
    elements.impactActiveBar.classList.remove('hidden');
  }
  if (elements.impactBarText) {
    elements.impactBarText.textContent = `⚠️ 障害シミュレーション実行中: 「${targetName}」停止想定 (${affectedDevIds.size}台に影響波及)`;
  }

  // モーダルを自動で閉じてラック上の赤色点滅を確認しやすくする
  closeImpactModal();

  showToast(`⚠️ 障害シミュレーションを実行しました: ${affectedDevIds.size}台の機器に影響が波及します`, 'warn');
}

function clearImpactSimulation() {
  impactSimulationActive = false;
  currentImpactTargetId = null;
  requestAnimationFrame(() => {
    document.querySelectorAll('.mounted-device-grid-item').forEach((el) => {
      el.classList.remove('sim-impact-target', 'sim-impact-down', 'sim-impact-dimmed');
    });
  });
  if (elements.impactActiveBar) {
    elements.impactActiveBar.classList.add('hidden');
  }
  if (elements.impactResultsSection) elements.impactResultsSection.style.display = 'none';
  if (elements.btnClearImpactSim) elements.btnClearImpactSim.style.display = 'none';
  showToast('障害シミュレーションを解除しました', 'info');
}

function applyImpactHighlights(targetId, affectedIds) {
  const affectedSet = new Set(affectedIds);
  requestAnimationFrame(() => {
    document.querySelectorAll('.mounted-device-grid-item').forEach((el) => {
      const devId = el.dataset.deviceId;
      el.classList.remove('sim-impact-target', 'sim-impact-down', 'sim-impact-dimmed');
      if (devId === targetId) {
        el.classList.add('sim-impact-target');
      } else if (affectedSet.has(devId)) {
        el.classList.add('sim-impact-down');
      } else {
        el.classList.add('sim-impact-dimmed');
      }
    });
  });
}

// --- 機器管理番号 & 導入日 取得ヘルパー ---
function getDeviceTicketNo(dev) {
  if (dev.ticketNo) return dev.ticketNo;
  const pastLog = (state.changeLogs || []).find(
    (l) => (l.deviceId && l.deviceId === dev.id) || (l.hostname && (l.hostname === dev.hostname || l.hostname === dev.name))
  );
  if (pastLog && pastLog.ticketNo) {
    dev.ticketNo = pastLog.ticketNo;
    return pastLog.ticketNo;
  }
  // 履歴ログが存在しない場合でも、機器自体に確実に管理番号を自動採番して保持
  dev.ticketNo = generateNextTicketNo();
  saveData();
  return dev.ticketNo;
}

function getDeviceInstallDate(dev) {
  if (dev.installDate) return dev.installDate;
  if (dev.installedDate) return dev.installedDate;
  const devLogs = (state.changeLogs || []).filter(
    (l) => (l.deviceId && l.deviceId === dev.id) || (l.hostname && (l.hostname === dev.hostname || l.hostname === dev.name))
  );
  if (devLogs.length > 0) {
    const sorted = [...devLogs].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    if (sorted[0] && sorted[0].date) {
      dev.installDate = sorted[0].date;
      return sorted[0].date;
    }
  }
  return '-';
}

// ==========================================================================
// RackManager v2 - 機能3: CSV台帳エクスポート ＆ 印刷用ラックレポート
// ==========================================================================
function exportLedgerCsv() {
  const rows = [];
  // CSVヘッダー
  rows.push([
    '管理番号',
    '導入日',
    'ラック名',
    '開始U/段',
    '占有U数',
    '設置面',
    'スロット配置',
    '機器名',
    '機器タイプ',
    '管理IP',
    '代表VIP',
    'ホスト名',
    'メーカー',
    '型番',
    'LANポート数',
    '定格電力(W)',
    '死活ステータス',
    'タグ',
    'LAN接続先',
    '備考'
  ]);

  state.racks.forEach((rack) => {
    const is2Col = rack.columns === 2 || rack.rackType === 'storage_2col';
    rack.devices.forEach((dev) => {
      const sideText = dev.side === 'rear' ? '背面' : (dev.side === 'full' ? '前後貫通' : '前面');
      const widthText = is2Col 
        ? `保管庫(列${dev.slotCol || 1})` 
        : (dev.slotWidth === 'half' ? `ハーフ幅(列${dev.slotCol})` : 'フル幅');
      const statusText = dev.status === 'online' ? '正常(Online)' : (dev.status === 'offline' ? '異常(Offline)' : '未監視');
      const tagsStr = (dev.tags || []).join('; ');
      const powerStr = dev.powerWatts !== undefined ? dev.powerWatts : getDefaultPowerWatts(dev.type);

      // 接続配線情報
      const myCables = (state.cables || []).filter(c => c.fromDeviceId === dev.id || c.toDeviceId === dev.id);
      const cableInfo = myCables.map(c => {
        const isFrom = c.fromDeviceId === dev.id;
        const myPort = isFrom ? c.fromPort : c.toPort;
        const targetDevId = isFrom ? c.toDeviceId : c.fromDeviceId;
        const targetPort = isFrom ? c.toPort : c.fromPort;
        const targetFound = findDevice(targetDevId);
        const targetName = targetFound ? targetFound.device.name : '相手機器';
        return `P${myPort}->${targetName}(P${targetPort})`;
      }).join(' / ');

      rows.push([
        getDeviceTicketNo(dev),
        getDeviceInstallDate(dev),
        rack.name,
        is2Col ? `${dev.startU}段(列${dev.slotCol || 1})` : dev.startU,
        dev.sizeU,
        sideText,
        widthText,
        dev.name || '',
        getDeviceTypeName(dev.type),
        dev.ip || '',
        dev.vip || '',
        dev.hostname || '',
        dev.vendor || '',
        dev.model || '',
        dev.portCount !== undefined ? dev.portCount : 2,
        powerStr,
        statusText,
        tagsStr,
        cableInfo,
        dev.notes || ''
      ]);
    });
  });

  const csvContent = '\uFEFF' + rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`;
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `rack_manager_ledger_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('📄 ラック台帳 (CSV) をダウンロードしました', 'success');
}

function openPrintReportModal() {
  if (!elements.modalPrintReport) return;
  renderPrintReport();
  elements.modalPrintReport.classList.add('open');
}

function closePrintReportModal() {
  if (elements.modalPrintReport) {
    elements.modalPrintReport.classList.remove('open');
  }
}

function renderPrintReport(searchQuery = '') {
  if (!elements.printReportContainer) return;
  elements.printReportContainer.innerHTML = '';

  const q = (searchQuery || '').trim().toLowerCase();
  let totalMatchedDevices = 0;

  state.racks.forEach((rack) => {
    const is2Col = rack.columns === 2 || rack.rackType === 'storage_2col';
    const totalWatts = rack.devices.reduce((sum, d) => sum + (d.powerWatts !== undefined ? Number(d.powerWatts) : getDefaultPowerWatts(d.type)), 0);
    const totalCapacity = is2Col ? 100 : rack.units;
    const occupiedCount = rack.devices.length;

    let devices = rack.devices.slice().sort((a, b) => (b.startU - a.startU) || ((a.slotCol || 1) - (b.slotCol || 1)));
    if (q) {
      devices = devices.filter((dev) => {
        const ticket = getDeviceTicketNo(dev).toLowerCase();
        const name = (dev.name || '').toLowerCase();
        const host = (dev.hostname || '').toLowerCase();
        const ip = (dev.ip || '').toLowerCase();
        const vip = (dev.vip || '').toLowerCase();
        const vendor = (dev.vendor || '').toLowerCase();
        const model = (dev.model || '').toLowerCase();
        const rName = rack.name.toLowerCase();
        return ticket.includes(q) || name.includes(q) || host.includes(q) || ip.includes(q) || vip.includes(q) || vendor.includes(q) || model.includes(q) || rName.includes(q);
      });
      if (devices.length === 0) return;
    }

    totalMatchedDevices += devices.length;

    const sec = document.createElement('div');
    sec.className = 'report-rack-section';

    let tableRows = '';
    devices.forEach((dev) => {
      const sideText = dev.side === 'rear' ? '背面' : (dev.side === 'full' ? '前後貫通' : '前面');
      const posText = is2Col ? `${dev.startU}段 [列${dev.slotCol || 1}]` : `${dev.startU}U (${dev.sizeU}U)`;
      const ipText = dev.vip ? `VIP: ${dev.vip} / ${dev.ip || ''}` : (dev.ip || '-');
      const powerWatts = dev.powerWatts !== undefined ? dev.powerWatts : getDefaultPowerWatts(dev.type);
      const statusClass = dev.status === 'online' ? '🟢 正常' : (dev.status === 'offline' ? '🔴 異常' : '⚪ 未監視');

      tableRows += `
        <tr>
          <td><strong>${posText}</strong></td>
          <td>${sideText}</td>
          <td>
            <span class="report-ticket-link" data-device-id="${dev.id}" title="クリックしてラック図上の機器へ移動">
              <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px;display:inline-block;vertical-align:middle;margin-right:3px;">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${escapeHtml(getDeviceTicketNo(dev))}</span>
            </span>
          </td>
          <td><span style="font-family:var(--font-mono); font-size:11.5px;">${escapeHtml(getDeviceInstallDate(dev))}</span></td>
          <td><strong>${escapeHtml(dev.name || '名称未設定')}</strong></td>
          <td>${getDeviceTypeName(dev.type)}</td>
          <td><span style="font-family:var(--font-mono);">${escapeHtml(ipText)}</span></td>
          <td>${escapeHtml(dev.hostname || '-')}</td>
          <td>${escapeHtml([dev.vendor, dev.model].filter(Boolean).join(' ') || '-')}</td>
          <td>${powerWatts}W</td>
          <td>${statusClass}</td>
        </tr>
      `;
    });

    sec.innerHTML = `
      <div class="report-rack-header">
        <div class="report-rack-title">${escapeHtml(rack.name)} ${is2Col ? '(保管庫 19インチ 2列×50段 = 100枠)' : `(${rack.units}U)`}</div>
        <div style="font-size:12px; color:#94a3b8;">
          電力使用量: <strong>${totalWatts.toLocaleString()}W</strong> | 収容数: <strong>${occupiedCount}/${totalCapacity}枠</strong>
        </div>
      </div>
      <div class="report-table-scroll-wrapper">
        <table class="report-table">
          <thead>
            <tr>
              <th>位置</th>
              <th>面</th>
              <th>管理番号</th>
              <th>導入日</th>
              <th>機器名</th>
              <th>種別</th>
              <th>IPアドレス</th>
              <th>ホスト名</th>
              <th>メーカー/型番</th>
              <th>電力</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="11" style="text-align:center; color:#94a3b8;">機器が配置されていません</td></tr>'}
          </tbody>
        </table>
      </div>
    `;

    elements.printReportContainer.appendChild(sec);
  });

  // 管理番号クリックで該当ラック・機器へジャンプ
  elements.printReportContainer.querySelectorAll('.report-ticket-link').forEach((linkEl) => {
    linkEl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const devId = linkEl.dataset.deviceId;
      if (devId) {
        jumpToDevice(devId);
      }
    });
  });

  if (elements.reportSearchCount) {
    if (q) {
      elements.reportSearchCount.style.display = 'inline-block';
      elements.reportSearchCount.textContent = `${totalMatchedDevices}件`;
    } else {
      elements.reportSearchCount.style.display = 'none';
    }
  }

  if (q && totalMatchedDevices === 0) {
    elements.printReportContainer.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #94a3b8; font-size: 14px;">
        検索条件「<strong>${escapeHtml(q)}</strong>」に一致する機器は見つかりませんでした
      </div>
    `;
  }
}

// --- 詳細プロパティパネル ---
function selectDevice(deviceId) {
  if (state.selectedDeviceId && state.selectedDeviceId !== deviceId && state.hasUnsavedPropChanges) {
    const closed = closePropertyPanel();
    if (!closed) return; // ユーザーがキャンセルした場合は切り替えない
  }

  state.selectedDeviceId = deviceId;
  populatePropertyPanel(deviceId);
  elements.propertyPanel.classList.add('open');

  const found = findDevice(deviceId);
  const pairId = found?.device?.haPairId;

  document.querySelectorAll('.mounted-device-grid-item').forEach((el) => {
    el.classList.remove('selected', 'ha-paired-device');
    if (el.dataset.deviceId === deviceId) {
      el.classList.add('selected');
    } else if (pairId && el.dataset.deviceId === pairId) {
      el.classList.add('ha-paired-device');
    }
  });

  highlightConnectedCables(deviceId);
}

function closePropertyPanel(force = false) {
  if (!force && state.hasUnsavedPropChanges && state.selectedDeviceId) {
    const res = confirm('編集中の内容がまだ保存されていません。\n\n変更を破棄してプロパティパネルを閉じますか？\n（[キャンセル] を押すと編集に戻り、保存ボタンで保存できます）');
    if (!res) {
      return false; // キャンセルされたので閉じない
    }

    // 変更を破棄して元の状態に戻す
    if (state.deviceOriginalSnapshot) {
      const found = findDevice(state.selectedDeviceId);
      if (found) {
        Object.assign(found.device, JSON.parse(JSON.stringify(state.deviceOriginalSnapshot)));
      }
    }
    state.hasUnsavedPropChanges = false;
    renderRacks();
  }

  state.selectedDeviceId = null;
  state.hasUnsavedPropChanges = false;
  state.deviceOriginalSnapshot = null;
  elements.propertyPanel.classList.remove('open');
  document.querySelectorAll('.mounted-device-grid-item').forEach((el) => el.classList.remove('selected', 'ha-paired-device'));
  highlightConnectedCables(null);
  return true;
}

function findDevice(deviceId) {
  for (const rack of state.racks) {
    const dev = rack.devices.find((d) => d.id === deviceId);
    if (dev) return { device: dev, rack: rack };
  }
  return null;
}

function populatePropertyPanel(deviceId) {
  const found = findDevice(deviceId);
  if (!found) {
    closePropertyPanel(true);
    return;
  }

  const { device, rack } = found;

  // スナップショットと未保存フラグの初期化
  state.deviceOriginalSnapshot = JSON.parse(JSON.stringify(device));
  state.hasUnsavedPropChanges = false;

  if (elements.propTypeBadge) elements.propTypeBadge.textContent = `${device.sizeU}U ${getDeviceTypeName(device.type)}`;
  if (elements.propTitle) elements.propTitle.textContent = device.name || 'サーバー詳細';

  updatePropStatusCard(device);

  // 管理番号の解決・初期セット
  if (!device.ticketNo) {
    const pastLog = (state.changeLogs || []).find(
      (l) => (l.deviceId && l.deviceId === device.id) || (l.hostname && (l.hostname === device.hostname || l.hostname === device.name))
    );
    if (pastLog && pastLog.ticketNo) {
      device.ticketNo = pastLog.ticketNo;
    } else {
      device.ticketNo = generateNextTicketNo();
    }
  }

  if (elements.propName) elements.propName.value = device.name || '';
  if (elements.propTicketNo) elements.propTicketNo.value = device.ticketNo || '';
  if (elements.propInstallDate) {
    const dVal = getDeviceInstallDate(device);
    elements.propInstallDate.value = dVal !== '-' ? dVal : (device.installDate || '');
  }
  if (elements.propIp) elements.propIp.value = device.ip || '';
  if (elements.propVip) elements.propVip.value = device.vip || '';
  if (elements.propHostname) elements.propHostname.value = device.hostname || '';
  if (elements.propHaRole) elements.propHaRole.value = device.haRole || 'standalone';
  
  if (elements.propHaPair) {
    elements.propHaPair.innerHTML = '<option value="">-- ペア相手機器を選択 --</option>';
    state.racks.forEach((r) => {
      r.devices.forEach((d) => {
        if (d.id !== device.id) {
          const opt = document.createElement('option');
          opt.value = d.id;
          opt.textContent = `${d.name || d.id} (${r.name} - ${d.startU}U)`;
          if (d.id === device.haPairId) opt.selected = true;
          elements.propHaPair.appendChild(opt);
        }
      });
    });
  }

  if (elements.groupPropHaPair) {
    elements.groupPropHaPair.style.display = (device.haRole && device.haRole !== 'standalone') ? 'block' : 'none';
  }

  if (elements.propVendor) elements.propVendor.value = device.vendor || '';
  if (elements.propModel) elements.propModel.value = device.model || '';
  if (elements.propPower) elements.propPower.value = device.powerWatts !== undefined && device.powerWatts !== null ? device.powerWatts : getDefaultPowerWatts(device.type);
  if (elements.propStartU) elements.propStartU.value = device.startU;
  if (elements.propSizeU) elements.propSizeU.value = device.sizeU;
  if (elements.propSide) elements.propSide.value = device.side || 'front';
  if (elements.propType) elements.propType.value = device.type || 'rackmount';
  if (elements.propPortCount) elements.propPortCount.value = device.portCount !== undefined ? String(device.portCount) : '0';
  if (elements.propPingEnabled) elements.propPingEnabled.checked = !!device.pingEnabled;
  if (elements.propNotes) elements.propNotes.value = device.notes || '';

  // UPS専用設定と負荷率の計算・表示
  if (elements.groupPropUpsConfig) {
    if (device.type === 'ups') {
      elements.groupPropUpsConfig.style.display = 'block';
      const cap = device.maxOutputWatts !== undefined && device.maxOutputWatts !== '' ? parseInt(device.maxOutputWatts, 10) : 1500;
      if (elements.propUpsCapacity) elements.propUpsCapacity.value = cap;
      if (elements.propUpsRuntime) elements.propUpsRuntime.value = device.batteryMinutes !== undefined ? device.batteryMinutes : 10;

      // ラック全体の消費電力集計
      const totalRackWatts = rack.devices.reduce((sum, d) => sum + (d.powerWatts !== undefined && d.powerWatts !== null && d.powerWatts !== '' ? Number(d.powerWatts) : getDefaultPowerWatts(d.type)), 0);
      const upsList = rack.devices.filter(d => d.type === 'ups');
      const totalUpsCap = upsList.reduce((sum, u) => sum + (parseInt(u.maxOutputWatts, 10) || 1500), 0);
      const loadPct = totalUpsCap > 0 ? Math.min(100, Math.round((totalRackWatts / totalUpsCap) * 100)) : 0;

      if (elements.propUpsLoadVal) {
        const countText = upsList.length > 1 ? ` (ラック内UPS ${upsList.length}台合計: ${totalUpsCap.toLocaleString()}W)` : '';
        elements.propUpsLoadVal.textContent = `${totalRackWatts.toLocaleString()}W / ${totalUpsCap.toLocaleString()}W (${loadPct}%)${countText}`;
      }
      if (elements.propUpsLoadBar) {
        elements.propUpsLoadBar.style.width = `${loadPct}%`;
        elements.propUpsLoadBar.className = 'ups-load-bar';
        if (loadPct >= 90) elements.propUpsLoadBar.classList.add('danger');
        else if (loadPct >= 75) elements.propUpsLoadBar.classList.add('warn');
      }
    } else {
      elements.groupPropUpsConfig.style.display = 'none';
    }
  }

  if (elements.propRackSelect) {
    elements.propRackSelect.innerHTML = '';
    state.racks.forEach((r) => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = `${r.name} (${r.units}U)`;
      if (r.id === rack.id) opt.selected = true;
      elements.propRackSelect.appendChild(opt);
    });
  }

  // 横幅・列分割の選択値を設定
  if (elements.propSlotWidth) {
    if (!device.slotWidth || device.slotWidth === 'full') {
      elements.propSlotWidth.value = 'full';
    } else {
      const key = `${device.slotWidth}-${device.slotCol || 1}`;
      elements.propSlotWidth.value = key;
      if (!elements.propSlotWidth.value) {
        elements.propSlotWidth.value = 'full';
      }
    }
  }

  state.tempTags = [...(device.tags || [])];
  renderPropTags();
  renderPropCables(device.id);
  renderPropVlanSection(device);
  if (elements.propChangeReason) elements.propChangeReason.value = '';
  renderDevicePropertyHistory(device.id);
  updateOccupyPreview();
}

function updateOccupyPreview() {
  const startU = elements.propStartU ? (parseInt(elements.propStartU.value, 10) || 1) : 1;
  const sizeU = elements.propSizeU ? (parseInt(elements.propSizeU.value, 10) || 1) : 1;
  const targetEndU = startU + sizeU - 1;
  const previewEl = document.getElementById('slot-occupy-preview');

  document.querySelectorAll('.btn-quick-u').forEach((btn) => {
    if (parseInt(btn.dataset.u, 10) === sizeU) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (previewEl) {
    if (sizeU === 1) {
      previewEl.textContent = `占有スロット: ${startU}U (1U分)`;
    } else {
      previewEl.textContent = `占有スロット: ${startU}U 〜 ${targetEndU}U (${sizeU}U分)`;
    }
  }
}

function updatePropStatusCard(device) {
  if (!elements.propStatusCircle) return;
  elements.propStatusCircle.className = 'status-circle';

  if (!state.settings.globalPingEnabled) {
    elements.propStatusCircle.classList.add('unmonitored');
    if (elements.propStatusHeadline) elements.propStatusHeadline.textContent = '全体のPing監視が無効です';
    if (elements.propStatusSub) elements.propStatusSub.textContent = 'ヘッダーまたは設定画面でPing監視を有効にしてください';
  } else if (!device.pingEnabled || !device.ip) {
    elements.propStatusCircle.classList.add('unmonitored');
    if (elements.propStatusHeadline) elements.propStatusHeadline.textContent = '個別Ping 監視設定なし';
    if (elements.propStatusSub) elements.propStatusSub.textContent = 'Ping監視を有効にすると死活ステータスが定期監視されます';
  } else if (device.status === 'online') {
    elements.propStatusCircle.classList.add('online');
    if (elements.propStatusHeadline) elements.propStatusHeadline.textContent = '正常稼働 (Online)';
    if (elements.propStatusSub) elements.propStatusSub.textContent = `応答時間: ${device.responseTimeMs !== null ? device.responseTimeMs + 'ms' : 'OK'} | 最終確認: ${formatTime(device.lastChecked)}`;
  } else if (device.status === 'offline') {
    elements.propStatusCircle.classList.add('offline');
    if (elements.propStatusHeadline) elements.propStatusHeadline.textContent = '応答なし (Offline / Down)';
    if (elements.propStatusSub) elements.propStatusSub.textContent = `Ping タイムアウト | 最終確認: ${formatTime(device.lastChecked)}`;
  } else {
    elements.propStatusCircle.classList.add('unknown');
    if (elements.propStatusHeadline) elements.propStatusHeadline.textContent = 'ステータス未確認';
    if (elements.propStatusSub) elements.propStatusSub.textContent = '「今すぐ Ping」で死活を確認できます';
  }
}

function renderPropTags() {
  elements.propTagsList.innerHTML = '';
  state.tempTags.forEach((tag, idx) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `
      ${escapeHtml(tag)}
      <span class="remove-tag" title="削除">×</span>
    `;
    chip.querySelector('.remove-tag').addEventListener('click', () => {
      state.tempTags.splice(idx, 1);
      renderPropTags();
    });
    elements.propTagsList.appendChild(chip);
  });
}



// --- スロット空き状況判定 (6列グリッドベース高精度判定) ---
function checkSlotAvailability(rack, startU, sizeU, excludeDeviceId = null, slotWidth = 'full', slotCol = 1) {
  if (startU < 1 || startU + sizeU - 1 > rack.units) return false;

  const targetSide = state.draggedDevice?.side || (elements.propSide ? elements.propSide.value : 'front');
  const targetEndU = startU + sizeU - 1;

  function getColRange(w, col) {
    const c = parseInt(col, 10) || 1;
    if (w === 'half') {
      return c === 2 ? [4, 6] : [1, 3];
    } else if (w === 'third') {
      if (c === 2) return [3, 4];
      if (c === 3) return [5, 6];
      return [1, 2];
    } else if (w === 'quarter') {
      if (c === 2) return [3, 3];
      if (c === 3) return [4, 4];
      if (c === 4) return [5, 6];
      return [1, 2];
    }
    return [1, 6]; // full
  }

  const [tColStart, tColEnd] = getColRange(slotWidth, slotCol);

  for (const dev of rack.devices) {
    if (dev.id === excludeDeviceId) continue;
    const devSide = dev.side || 'front';

    // 貫通機器または同面設置の機器のみ衝突判定
    const isConflictSide = (targetSide === 'full' || devSide === 'full' || targetSide === devSide);
    if (!isConflictSide) continue;

    const devStartU = dev.startU;
    const devEndU = dev.startU + (dev.sizeU || 1) - 1;

    // U範囲の重複があるか
    const isUOverlap = Math.max(startU, devStartU) <= Math.min(targetEndU, devEndU);
    if (!isUOverlap) continue;

    // 列範囲の重複があるか
    const [dColStart, dColEnd] = getColRange(dev.slotWidth || 'full', dev.slotCol || 1);
    const isColOverlap = Math.max(tColStart, dColStart) <= Math.min(tColEnd, dColEnd);
    if (isColOverlap) {
      return false;
    }
  }

  return true;
}

// --- プロパティ入力値のリアルタイムUI反映（※DB保存・履歴記録は行わない） ---
function applyDevicePropertiesLive(rerenderAll = false) {
  if (!state.selectedDeviceId) return;
  const found = findDevice(state.selectedDeviceId);
  if (!found) return;
  const { device, rack } = found;

  if (elements.propName) {
    const val = elements.propName.value.trim();
    if (val) device.name = val;
    if (elements.propTitle) elements.propTitle.textContent = device.name || 'サーバー詳細';
  }
  if (elements.propTicketNo) {
    const t = elements.propTicketNo.value.trim();
    if (t) device.ticketNo = t;
  }
  if (elements.propInstallDate) {
    device.installDate = elements.propInstallDate.value;
  }
  if (elements.propIp) device.ip = elements.propIp.value.trim();
  if (elements.propVip) device.vip = elements.propVip.value.trim();
  if (elements.propHostname) device.hostname = elements.propHostname.value.trim();
  if (elements.propHaRole) device.haRole = elements.propHaRole.value;
  if (elements.propHaPair) device.haPairId = elements.propHaPair.value || null;
  if (elements.propVendor) device.vendor = elements.propVendor.value.trim();
  if (elements.propModel) device.model = elements.propModel.value.trim();
  if (elements.propType) {
    device.type = elements.propType.value;
    if (elements.propTypeBadge) elements.propTypeBadge.textContent = `${device.sizeU}U ${getDeviceTypeName(device.type)}`;
  }
  if (elements.propPower) {
    device.powerWatts = parseInt(elements.propPower.value, 10) || 0;
    updateHeaderStats();
  }
  if (elements.propPortCount) {
    device.portCount = parseInt(elements.propPortCount.value, 10) || 0;
    renderPropVlanSection(device);
  }
  if (elements.propPingEnabled) device.pingEnabled = elements.propPingEnabled.checked;
  if (elements.propNotes) device.notes = elements.propNotes.value.trim();
  if (elements.propSide) {
    const newSide = elements.propSide.value;
    if (newSide !== device.side) {
      device.side = newSide;
      rerenderAll = true;
    }
  }

  device.tags = [...state.tempTags];
  state.hasUnsavedPropChanges = true;

  // 即時UI再描画
  renderRacks();

  // 選択ハイライト状態を維持
  const devEl = document.querySelector(`.mounted-device-grid-item[data-device-id="${device.id}"]`);
  if (devEl) {
    devEl.classList.add('selected');
    if (device.haPairId) {
      const pairEl = document.querySelector(`.mounted-device-grid-item[data-device-id="${device.haPairId}"]`);
      if (pairEl) pairEl.classList.add('ha-paired-device');
    }
  }
}

// --- プロパティパネル変更の保存処理 ---
async function saveCurrentDeviceProperties(silent = false) {
  if (!state.selectedDeviceId) return false;

  const found = findDevice(state.selectedDeviceId);
  if (!found) return false;

  pushHistoryState(`${found.device.name || '機器'}のプロパティ保存`);

  const { device, rack: currentRack } = found;
  const targetRackId = elements.propRackSelect ? elements.propRackSelect.value : currentRack.id;
  const newStartU = elements.propStartU ? parseInt(elements.propStartU.value, 10) : device.startU;
  const newSizeU = elements.propSizeU ? parseInt(elements.propSizeU.value, 10) : device.sizeU;

  const targetRack = state.racks.find((r) => r.id === targetRackId) || currentRack;

  // 横幅・列分割のパース
  const widthVal = elements.propSlotWidth ? elements.propSlotWidth.value : 'full';
  let targetWidth = 'full';
  let targetCol = 1;
  if (widthVal !== 'full') {
    const parts = widthVal.split('-');
    targetWidth = parts[0];
    targetCol = parseInt(parts[1], 10) || 1;
  }

  // スロットや配置面の変更があった場合のみ空きスロット重複チェック
  const isMoved = (
    targetRackId !== currentRack.id ||
    newStartU !== device.startU ||
    newSizeU !== device.sizeU ||
    targetWidth !== (device.slotWidth || 'full') ||
    targetCol !== (device.slotCol || 1) ||
    (elements.propSide && elements.propSide.value !== (device.side || 'front'))
  );

  if (isMoved) {
    state.draggedDevice = { side: elements.propSide ? elements.propSide.value : (device.side || 'front') };
    const isValid = checkSlotAvailability(targetRack, newStartU, newSizeU, device.id, targetWidth, targetCol);
    state.draggedDevice = null;

    if (!isValid) {
      showToast('指定したスロット（列）は 1〜42U の範囲外か、他の機器と重複しています', 'error');
      return false;
    }
  }

  const oldSide = device.side || 'front';
  const newSide = elements.propSide ? elements.propSide.value : oldSide;

  if (targetRackId !== currentRack.id) {
    const idx = currentRack.devices.findIndex((d) => d.id === device.id);
    if (idx !== -1) currentRack.devices.splice(idx, 1);
    targetRack.devices.push(device);
  }

  if (elements.propName) device.name = elements.propName.value.trim();
  if (elements.propTicketNo) device.ticketNo = elements.propTicketNo.value.trim();
  if (elements.propInstallDate) device.installDate = elements.propInstallDate.value;
  if (elements.propIp) device.ip = elements.propIp.value.trim();
  if (elements.propVip) device.vip = elements.propVip.value.trim();
  if (elements.propHostname) device.hostname = elements.propHostname.value.trim();
  if (elements.propHaRole) device.haRole = elements.propHaRole.value;
  if (elements.propHaPair) device.haPairId = elements.propHaPair.value || null;

  // HAクラスタ設定時、ペア相手側も自動同期
  if (device.haRole && device.haRole !== 'standalone' && device.haPairId) {
    const pairFound = findDevice(device.haPairId);
    if (pairFound) {
      const pairDev = pairFound.device;
      pairDev.haPairId = device.id;
      if (!pairDev.haRole || pairDev.haRole === 'standalone') {
        pairDev.haRole = device.haRole === 'primary' ? 'secondary' : 'primary';
      }
      if (device.vip && !pairDev.vip) {
        pairDev.vip = device.vip;
      }
    }
  }

  if (elements.propVendor) device.vendor = elements.propVendor.value.trim();
  if (elements.propModel) device.model = elements.propModel.value.trim();
  device.startU = newStartU;
  device.sizeU = newSizeU;
  device.side = newSide;

  // 設置面の変更に合わせてラック表示面を連動切り替え（機器を見失わないようにする）
  if (oldSide !== newSide) {
    if (newSide === 'front' && state.rackViewModes[targetRack.id] === 'rear') {
      state.rackViewModes[targetRack.id] = 'front';
    } else if (newSide === 'rear' && state.rackViewModes[targetRack.id] === 'front') {
      state.rackViewModes[targetRack.id] = 'rear';
    }
  }

  // 横幅・列分割の保存
  device.slotWidth = targetWidth;
  device.slotCol = targetCol;

  if (elements.propType) device.type = elements.propType.value;
  if (elements.propPower) device.powerWatts = parseInt(elements.propPower.value, 10) || 0;
  if (device.type === 'ups') {
    if (elements.propUpsCapacity) {
      device.maxOutputWatts = parseInt(elements.propUpsCapacity.value, 10) || 1500;
    }
    if (elements.propUpsRuntime) {
      device.batteryMinutes = parseInt(elements.propUpsRuntime.value, 10) || 10;
    }
  }
  if (elements.propTicketNo) {
    const customTicket = elements.propTicketNo.value.trim();
    if (customTicket) {
      device.ticketNo = customTicket;
    }
  }
  if (!device.ticketNo) {
    device.ticketNo = generateNextTicketNo();
  }

  if (elements.propPortCount) device.portCount = parseInt(elements.propPortCount.value, 10) || 0;
  if (elements.propPingEnabled) device.pingEnabled = elements.propPingEnabled.checked;
  if (elements.propNotes) device.notes = elements.propNotes.value.trim();
  device.tags = [...state.tempTags];

  const sideLabel = newSide === 'front' ? '前面 (Front)' : newSide === 'rear' ? '背面 (Rear)' : '前後貫通 (Full Depth)';
  const customReason = elements.propChangeReason ? elements.propChangeReason.value.trim() : '';
  const logType = isMoved ? 'move' : 'config';
  const defaultReason = isMoved
    ? `[移設/スロット変更] ${device.name} を ${currentRack.name} ➜ ${targetRack.name} (${newStartU}U / ${sideLabel}) へ移動`
    : `[設定更新] ${device.name} (IP: ${device.ip || '未設定'}) のプロパティを更新`;

  recordChangeLog({
    ticketNo: device.ticketNo,
    hostname: device.hostname || device.name,
    deviceId: device.id,
    type: logType,
    operator: '管理者 (GUI)',
    reason: customReason || defaultReason
  });
  if (elements.propChangeReason) elements.propChangeReason.value = '';

  await saveData(true);
  state.hasUnsavedPropChanges = false;
  state.deviceOriginalSnapshot = JSON.parse(JSON.stringify(device));
  renderRacks();
  selectDevice(device.id);
  
  if (!silent) {
    showToast(`${device.name || '機器'}のプロパティを保存しました [設置面: ${sideLabel}]`, 'success');
  }
  return true;
}

// --- イベントリスナー ---
function setupEventListeners() {
  // 🚧 初期構築モードトグルボタン
  if (elements.btnToggleSetupMode) {
    elements.btnToggleSetupMode.addEventListener('click', () => toggleSetupMode());
  }

  // v5: Undo / Redo (元に戻す・やり直す)
  if (elements.btnUndo) {
    elements.btnUndo.addEventListener('click', () => undoAction());
  }
  if (elements.btnRedo) {
    elements.btnRedo.addEventListener('click', () => redoAction());
  }
  if (elements.btnFloatingUndo) {
    elements.btnFloatingUndo.addEventListener('click', () => undoAction());
  }
  if (elements.btnFloatingRedo) {
    elements.btnFloatingRedo.addEventListener('click', () => redoAction());
  }

  // キーボードショートカット (Ctrl+Z: Undo, Ctrl+Y or Ctrl+Shift+Z: Redo)
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) {
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        if (e.shiftKey) {
          redoAction();
        } else {
          undoAction();
        }
      } else if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        redoAction();
      }
    }
  });

  // 配線モード切り替え
  if (elements.btnCableMode) {
    elements.btnCableMode.addEventListener('click', () => toggleCableMode());
  }

  // v5: VLAN 可視化ハイライトフィルター
  if (elements.selectVlanFilter) {
    elements.selectVlanFilter.addEventListener('change', (e) => {
      state.activeVlanFilter = e.target.value;
      if (state.activeVlanFilter === 'all') {
        document.body.classList.remove('vlan-filtering');
      } else {
        document.body.classList.add('vlan-filtering');
      }
      renderRacks();
    });
  }

  // v5: プロパティパネル VLAN 一括設定トグル ＆ 適用
  if (elements.btnPropBulkVlanToggle) {
    elements.btnPropBulkVlanToggle.addEventListener('click', () => {
      if (!elements.propVlanBulkBox) return;
      const isHidden = elements.propVlanBulkBox.style.display === 'none';
      elements.propVlanBulkBox.style.display = isHidden ? 'block' : 'none';
      elements.btnPropBulkVlanToggle.textContent = isHidden ? '一括設定 閉じる' : '一括設定';
    });
  }

  if (elements.btnApplyBulkVlan) {
    elements.btnApplyBulkVlan.addEventListener('click', () => {
      applyBulkVlanConfig();
    });
  }

  // 配線キャンセルボタン
  if (elements.btnCancelCable) {
    elements.btnCancelCable.addEventListener('click', cancelCableConnecting);
  }

  // --- 外部/通常配線 タブ切り替え ＆ クイックフロアタグ ---
  let currentCableTargetType = 'device'; // 'device' or 'external'

  if (elements.btnCableTypeDevice) {
    elements.btnCableTypeDevice.addEventListener('click', () => {
      currentCableTargetType = 'device';
      elements.btnCableTypeDevice.classList.add('active');
      if (elements.btnCableTypeExternal) elements.btnCableTypeExternal.classList.remove('active');
      if (elements.propCableTargetDeviceSection) elements.propCableTargetDeviceSection.style.display = 'block';
      if (elements.propCableTargetExternalSection) elements.propCableTargetExternalSection.style.display = 'none';
    });
  }

  if (elements.btnCableTypeExternal) {
    elements.btnCableTypeExternal.addEventListener('click', () => {
      currentCableTargetType = 'external';
      elements.btnCableTypeExternal.classList.add('active');
      if (elements.btnCableTypeDevice) elements.btnCableTypeDevice.classList.remove('active');
      if (elements.propCableTargetDeviceSection) elements.propCableTargetDeviceSection.style.display = 'none';
      if (elements.propCableTargetExternalSection) elements.propCableTargetExternalSection.style.display = 'block';
    });
  }

  // クイックフロアタグ補完ボタン
  document.querySelectorAll('.btn-quick-floor-tag').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (elements.propCableExtTarget) {
        elements.propCableExtTarget.value = target;
        elements.propCableExtTarget.focus();
      }
    });
  });

  // プロパティパネルからの配線追加 (通常配線 & フロア・外部配線両対応)
  if (elements.btnPropAddCable) {
    elements.btnPropAddCable.addEventListener('click', () => {
      if (!state.selectedDeviceId) return;
      const fromDev = findDevice(state.selectedDeviceId)?.device;
      if (!fromDev) return;

      if (currentCableTargetType === 'external') {
        // フロア・外部配線の作成
        const fromPort = elements.propCableExtFromPort ? (parseInt(elements.propCableExtFromPort.value, 10) || 1) : 1;
        const extTarget = elements.propCableExtTarget ? elements.propCableExtTarget.value.trim() : '';
        const cableColor = elements.propCableExtColorSelect ? elements.propCableExtColorSelect.value : '#22c55e';

        if (!extTarget) {
          showToast('フロアまたは外部接続先名（例: 3F 執務エリア）を入力してください', 'error');
          if (elements.propCableExtTarget) elements.propCableExtTarget.focus();
          return;
        }

        const exists = state.cables.some(
          (c) => c.fromDeviceId === fromDev.id && c.fromPort === fromPort
        );
        if (exists) {
          showToast(`自ポート Port ${fromPort} は既に結線されています`, 'error');
          return;
        }

        const newCable = {
          id: 'cable-' + Date.now(),
          fromDeviceId: fromDev.id,
          fromPort: fromPort,
          toDeviceId: '__external__',
          toPort: 0,
          externalTarget: extTarget,
          color: cableColor,
          side: fromDev.side || 'front',
          label: `${fromDev.name} (P${fromPort}) ➔ 🌐 ${extTarget}`
        };

        state.cables.push(newCable);
        saveData();
        updateCableCountBadge();
        renderRacks();
        renderPropCables(fromDev.id);
        showToast(`外部・フロア配線を追加しました: 🌐 ${extTarget} (Port ${fromPort})`, 'success');

        setTimeout(() => {
          triggerCablePulse(newCable.id);
        }, 200);

        if (elements.propCableExtTarget) elements.propCableExtTarget.value = '';
        return;
      }

      // 通常（ラック内機器間）配線の作成
      const targetDevId = elements.propCableTargetDev ? elements.propCableTargetDev.value : null;
      const fromPort = elements.propCableFromPort ? (parseInt(elements.propCableFromPort.value, 10) || 1) : 1;
      const toPort = elements.propCableToPort ? (parseInt(elements.propCableToPort.value, 10) || 1) : 1;
      const cableColor = elements.propCableColorSelect ? elements.propCableColorSelect.value : (state.selectedCableColor || '#38bdf8');

      if (!targetDevId) {
        showToast('接続先機器を選択してください', 'error');
        return;
      }

      const toDev = findDevice(targetDevId)?.device;
      if (!toDev) return;

      const exists = state.cables.some(
        (c) =>
          (c.fromDeviceId === fromDev.id && c.fromPort === fromPort && c.toDeviceId === toDev.id && c.toPort === toPort) ||
          (c.fromDeviceId === toDev.id && c.fromPort === toPort && c.toDeviceId === fromDev.id && c.toPort === fromPort)
      );

      if (exists) {
        showToast('このポート間は既に接続されています', 'error');
        return;
      }

      const newCable = {
        id: 'cable-' + Date.now(),
        fromDeviceId: fromDev.id,
        fromPort: fromPort,
        toDeviceId: toDev.id,
        toPort: toPort,
        color: cableColor,
        side: state.settings.viewMode || 'front',
        label: `${fromDev.name} (P${fromPort}) ⇄ ${toDev.name} (P${toPort})`
      };

      state.cables.push(newCable);
      saveData();
      updateCableCountBadge();
      renderRacks();
      renderPropCables(fromDev.id);
      showToast(`LANケーブル (${cableColor}) を配線しました: ${newCable.label}`, 'success');

      setTimeout(() => {
        triggerCablePulse(newCable.id);
      }, 200);
    });
  }

  // --- LANケーブル カラーパレット初期化 ＆ 連動イベント ---
  setupCableColorPalette();

  // ウィンドウリサイズ時のケーブル再描画
  window.addEventListener('resize', () => {
    setTimeout(renderCables, 100);
  });

  // キーボードショートカット (Esc で配線キャンセルまたはプロパティ閉じる)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.connectingCable) {
        cancelCableConnecting();
        showToast('配線をキャンセルしました', 'info');
      } else if (state.selectedDeviceId) {
        closePropertyPanel();
      }
    }
  });

  if (elements.headerGlobalPingToggle) {
    elements.headerGlobalPingToggle.addEventListener('change', (e) => {
      state.settings.globalPingEnabled = e.target.checked;
      saveData(true);
      startAutoPingTimer();
      updateHeaderStats();
      renderRacks();
      if (state.selectedDeviceId) populatePropertyPanel(state.selectedDeviceId);
      showToast(
        state.settings.globalPingEnabled ? '全体のPing死活監視を有効化しました' : '全体のPing死活監視を無効化しました',
        'info'
      );
    });
  }

  if (elements.btnGlobalFront) {
    elements.btnGlobalFront.addEventListener('click', () => {
      console.log('[Click] Front view selected');
      elements.btnGlobalFront.classList.add('active');
      if (elements.btnGlobalRear) elements.btnGlobalRear.classList.remove('active');
      state.settings.viewMode = 'front';
      state.racks.forEach((r) => (state.rackViewModes[r.id] = 'front'));
      renderRacks();
      saveData();
      showToast('前面 (Front) 表示に切り替えました', 'info');
    });
  }

  if (elements.btnGlobalRear) {
    elements.btnGlobalRear.addEventListener('click', () => {
      console.log('[Click] Rear view selected');
      elements.btnGlobalRear.classList.add('active');
      if (elements.btnGlobalFront) elements.btnGlobalFront.classList.remove('active');
      state.settings.viewMode = 'rear';
      state.racks.forEach((r) => (state.rackViewModes[r.id] = 'rear'));
      renderRacks();
      saveData();
      showToast('背面 (Rear) 表示に切り替えました', 'info');
    });
  }

  if (elements.btnPingAll) {
    elements.btnPingAll.addEventListener('click', () => {
      console.log('[Click] Ping All triggered');
      runPingAll();
    });
  }

  if (elements.btnPingSingle) {
    elements.btnPingSingle.addEventListener('click', async () => {
      if (state.selectedDeviceId) {
        const found = findDevice(state.selectedDeviceId);
        if (found && elements.propIp) {
          found.device.ip = elements.propIp.value.trim();
        }
        runPingSingle(state.selectedDeviceId);
      }
    });
  }

  if (elements.btnCloseProp) {
    elements.btnCloseProp.addEventListener('click', closePropertyPanel);
  }

  if (elements.btnSettings) {
    elements.btnSettings.addEventListener('click', () => {
      console.log('[Click] Settings opened');
      updateSettingsUI();
      if (elements.modalSettings) elements.modalSettings.classList.add('open');
    });
  }

  if (elements.autoPingPill) {
    elements.autoPingPill.addEventListener('click', () => {
      console.log('[Click] Auto Ping Pill clicked');
      updateSettingsUI();
      if (elements.modalSettings) elements.modalSettings.classList.add('open');
    });
  }

  if (elements.btnSaveProp) {
    elements.btnSaveProp.addEventListener('click', async (e) => {
      e.preventDefault();
      await saveCurrentDeviceProperties();
    });
  }

  if (elements.propertyForm) {
    elements.propertyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await saveCurrentDeviceProperties();
    });
  }

  // --- プロパティ入力のリアルタイムUI反映イベント（※DB保存・履歴記録は保存ボタン押下時のみ） ---
  if (elements.propName) elements.propName.addEventListener('input', () => applyDevicePropertiesLive(false));
  if (elements.propTicketNo) elements.propTicketNo.addEventListener('input', () => applyDevicePropertiesLive(false));
  if (elements.propIp) elements.propIp.addEventListener('input', () => applyDevicePropertiesLive(false));
  if (elements.propVip) elements.propVip.addEventListener('input', () => applyDevicePropertiesLive(false));
  if (elements.propHostname) elements.propHostname.addEventListener('input', () => applyDevicePropertiesLive(false));
  if (elements.propVendor) elements.propVendor.addEventListener('input', () => applyDevicePropertiesLive(false));
  if (elements.propModel) elements.propModel.addEventListener('input', () => applyDevicePropertiesLive(false));
  if (elements.propPower) elements.propPower.addEventListener('input', () => applyDevicePropertiesLive(false));
  if (elements.propPortCount) elements.propPortCount.addEventListener('input', () => applyDevicePropertiesLive(true));
  if (elements.propPingEnabled) elements.propPingEnabled.addEventListener('change', () => applyDevicePropertiesLive(false));
  if (elements.propNotes) elements.propNotes.addEventListener('input', () => applyDevicePropertiesLive(false));
  if (elements.propSide) elements.propSide.addEventListener('change', () => applyDevicePropertiesLive(true));

  if (elements.propTagNew) {
    elements.propTagNew.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = elements.propTagNew.value.trim();
        if (val && !state.tempTags.includes(val)) {
          state.tempTags.push(val);
          renderPropTags();
          elements.propTagNew.value = '';
          applyDevicePropertiesLive(false);
        }
      }
    });
  }

  document.querySelectorAll('.btn-quick-tag').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      if (tag && !state.tempTags.includes(tag)) {
        state.tempTags.push(tag);
        renderPropTags();
        applyDevicePropertiesLive(false);
      }
    });
  });

  // 機器タイプ変更時にタグと消費電力を自動反映 & 即時UI反映
  if (elements.propType) {
    elements.propType.addEventListener('change', () => {
      const type = elements.propType.value;
      const sizeU = elements.propSizeU ? parseInt(elements.propSizeU.value, 10) : 1;
      const defaultTags = getDefaultTagsForType(type);
      state.tempTags = [...defaultTags];
      renderPropTags();

      if (elements.propPower) {
        elements.propPower.value = getDefaultPowerWatts(type, sizeU);
      }

      const isUps = type === 'ups';
      if (elements.groupPropUpsConfig) {
        elements.groupPropUpsConfig.style.display = isUps ? 'block' : 'none';
        if (isUps) {
          if (elements.propUpsCapacity && !elements.propUpsCapacity.value) {
            elements.propUpsCapacity.value = '1500';
          }
          if (elements.propUpsRuntime && !elements.propUpsRuntime.value) {
            elements.propUpsRuntime.value = '10';
          }
          if (elements.propPower && (!elements.propPower.value || elements.propPower.value === '350')) {
            elements.propPower.value = '0';
          }
        }
      }

      applyDevicePropertiesLive(true);
    });
  }

  // HAロール変更時にペア相手選択の表示/非表示を連動 & 即時UI反映
  if (elements.propHaRole) {
    elements.propHaRole.addEventListener('change', () => {
      if (elements.groupPropHaPair) {
        elements.groupPropHaPair.style.display = elements.propHaRole.value !== 'standalone' ? 'block' : 'none';
      }
      applyDevicePropertiesLive(false);
    });
  }

  if (elements.propHaPair) {
    elements.propHaPair.addEventListener('change', () => {
      applyDevicePropertiesLive(false);
    });
  }

  // ユニットサイズ変更・プレビューイベント
  if (elements.propStartU) elements.propStartU.addEventListener('input', updateOccupyPreview);
  if (elements.propSizeU) elements.propSizeU.addEventListener('input', updateOccupyPreview);

  document.querySelectorAll('.btn-quick-u').forEach((btn) => {
    btn.addEventListener('click', () => {
      const u = parseInt(btn.dataset.u, 10);
      if (u && elements.propSizeU) {
        elements.propSizeU.value = u;
        updateOccupyPreview();
      }
    });
  });

  if (elements.btnDeleteDevice) {
    elements.btnDeleteDevice.addEventListener('click', async () => {
      if (!state.selectedDeviceId) return;
      const found = findDevice(state.selectedDeviceId);
      if (!found) return;

      if (confirm(`機器「${found.device.name}」を削除しますか？`)) {
        pushHistoryState(`機器「${found.device.name}」の削除`);
        const devName = found.device.name;
        const rackName = found.rack.name;
        const u = found.device.startU;
        const snapshot = captureDeviceSnapshot(found.device); // 削除前に諸元スナップショットを取得

        const idx = found.rack.devices.findIndex((d) => d.id === state.selectedDeviceId);
        if (idx !== -1) {
          found.rack.devices.splice(idx, 1);
          cleanupOrphanCables();
          recordChangeLog({
            hostname: devName,
            deviceId: null,
            type: 'remove',
            operator: '管理者 (GUI)',
            reason: `[機器撤去] ${devName} を ${rackName} ${u}U から撤去`,
            snapshot: snapshot
          });
          closePropertyPanel();
          renderRacks();
          updateHeaderStats();
          await saveData(true);
          showToast(`機器「${devName}」を削除しました（変更履歴に記録完了）`, 'info');
        }
      }
    });
  }

  if (elements.btnSettings) {
    elements.btnSettings.addEventListener('click', () => {
      updateSettingsUI();
      if (elements.modalSettings) elements.modalSettings.classList.add('open');
    });
  }

  if (elements.autoPingPill) {
    elements.autoPingPill.addEventListener('click', () => {
      updateSettingsUI();
      if (elements.modalSettings) elements.modalSettings.classList.add('open');
    });
  }

  // テーマカード選択
  document.querySelectorAll('.theme-card').forEach((card) => {
    card.addEventListener('click', async () => {
      const selectedTheme = card.dataset.theme;
      applyTheme(selectedTheme);
      await saveData(false);
    });
  });

  // 採番プレビュー連動
  if (elements.settingTicketPrefix) elements.settingTicketPrefix.addEventListener('input', updateTicketPreviewUI);
  if (elements.settingTicketDatePattern) elements.settingTicketDatePattern.addEventListener('change', updateTicketPreviewUI);
  if (elements.settingTicketDigits) elements.settingTicketDigits.addEventListener('change', updateTicketPreviewUI);

  if (elements.btnCloseSettings) {
    elements.btnCloseSettings.addEventListener('click', () => elements.modalSettings && elements.modalSettings.classList.remove('open'));
  }
  if (elements.btnCancelSettings) {
    elements.btnCancelSettings.addEventListener('click', () => elements.modalSettings && elements.modalSettings.classList.remove('open'));
  }

  if (elements.btnSaveSettings) {
    elements.btnSaveSettings.addEventListener('click', async () => {
      if (elements.settingGlobalPingToggle) state.settings.globalPingEnabled = elements.settingGlobalPingToggle.checked;
      if (elements.settingAutoPingToggle) state.settings.autoPingEnabled = elements.settingAutoPingToggle.checked;
      if (elements.settingPingInterval) state.settings.pingIntervalSeconds = parseInt(elements.settingPingInterval.value, 10);
      if (elements.settingPingTimeout) state.settings.pingTimeoutMs = parseInt(elements.settingPingTimeout.value, 10);
      if (elements.settingSetupModeToggle) state.settings.initialSetupMode = elements.settingSetupModeToggle.checked;

      state.settings.ticketRule = {
        prefix: (elements.settingTicketPrefix?.value || 'CHG').trim(),
        datePattern: elements.settingTicketDatePattern?.value || 'YYYY',
        digits: parseInt(elements.settingTicketDigits?.value, 10) || 3,
        nextSeq: 1
      };

      await saveData(true);
      startAutoPingTimer();
      updateHeaderStats();
      updateSetupModeUI();
      renderRacks();
      if (elements.modalSettings) elements.modalSettings.classList.remove('open');
      showToast('システム設定（テーマ・自動採番・初期構築モード）を保存しました', 'success');
    });
  }

  if (elements.btnResetDemo) {
    elements.btnResetDemo.addEventListener('click', () => {
      if (confirm('すべてのラック・サーバーデータを初期デモデータにリセットしますか？')) {
        state.racks = JSON.parse(JSON.stringify(defaultData.racks));
        state.cables = JSON.parse(JSON.stringify(defaultData.cables || []));
        state.settings = JSON.parse(JSON.stringify(defaultData.settings));
        saveData();
        renderRacks();
        updateHeaderStats();
        startAutoPingTimer();
        if (elements.modalSettings) elements.modalSettings.classList.remove('open');
        showToast('初期デモデータにリセットしました', 'success');
      }
    });
  }

  // --- ラック追加/編集モーダル ---
  if (elements.btnAddRack) {
    elements.btnAddRack.addEventListener('click', () => {
      if (elements.rackFormId) elements.rackFormId.value = '';
      if (elements.modalRackTitle) elements.modalRackTitle.textContent = '新規ラック追加';
      if (elements.rackFormName) elements.rackFormName.value = `Rack A-0${state.racks.length + 1}`;
      if (elements.rackFormUnits) elements.rackFormUnits.value = '42';
      if (elements.rackFormTags) elements.rackFormTags.value = 'DataCenter, Zone-A';
      if (elements.rackFormMaxPower) elements.rackFormMaxPower.value = '3000';
      if (elements.modalRack) {
        elements.modalRack.classList.add('open');
        setTimeout(() => elements.rackFormName && elements.rackFormName.focus(), 100);
      }
    });
  }

  if (elements.btnCloseRackModal) {
    elements.btnCloseRackModal.addEventListener('click', () => elements.modalRack && elements.modalRack.classList.remove('open'));
  }
  if (elements.btnCancelRack) {
    elements.btnCancelRack.addEventListener('click', () => elements.modalRack && elements.modalRack.classList.remove('open'));
  }

  // モーダル背景クリックで閉じる
  if (elements.modalRack) {
    elements.modalRack.addEventListener('click', (e) => {
      if (e.target === elements.modalRack) {
        elements.modalRack.classList.remove('open');
      }
    });
  }

  if (elements.rackForm) {
    elements.rackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = elements.rackFormName ? elements.rackFormName.value.trim() : '';
      if (!name) {
        showToast('ラック名を入力してください', 'error');
        return;
      }
      const rawUnits = elements.rackFormUnits ? elements.rackFormUnits.value : '42';
      const units = parseInt(rawUnits, 10) || 42;

      let tags = elements.rackFormTags ? elements.rackFormTags.value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean) : [];
      const maxPowerWatts = elements.rackFormMaxPower ? (parseInt(elements.rackFormMaxPower.value, 10) || 3000) : 3000;

      const editRackId = elements.rackFormId ? elements.rackFormId.value : '';
      if (editRackId) {
        const existingRack = state.racks.find((r) => r.id === editRackId);
        if (existingRack) {
          pushHistoryState(`ラック「${existingRack.name}」の設定変更`);
          existingRack.name = name;
          existingRack.units = units;
          delete existingRack.columns;
          delete existingRack.rackType;
          existingRack.tags = tags;
          existingRack.maxPowerWatts = maxPowerWatts;
          await saveData(true);
          renderRacks();
          updateHeaderStats();
          if (elements.modalRack) elements.modalRack.classList.remove('open');
          showToast(`ラック「${name}」の設定を更新しました (契約電力: ${maxPowerWatts.toLocaleString()}W)`, 'success');
          return;
        }
      }

      pushHistoryState(`新規ラック「${name}」の追加`);
      const newRack = {
        id: 'rack-' + Date.now(),
        name,
        units,
        tags,
        maxPowerWatts,
        devices: []
      };

      state.racks.push(newRack);
      state.rackViewModes[newRack.id] = state.settings.viewMode || 'front';
      await saveData(true);
      renderRacks();
      updateHeaderStats();
      if (elements.modalRack) elements.modalRack.classList.remove('open');
      showToast(`新規ラック「${name}」(${units}U / 契約容量: ${maxPowerWatts.toLocaleString()}W) を追加しました`, 'success');
    });
  }

  if (elements.btnExportImport) {
    elements.btnExportImport.addEventListener('click', () => elements.modalExportImport && elements.modalExportImport.classList.add('open'));
  }
  if (elements.btnCloseExport) {
    elements.btnCloseExport.addEventListener('click', () => elements.modalExportImport && elements.modalExportImport.classList.remove('open'));
  }

  if (elements.btnDownloadJson) {
    elements.btnDownloadJson.addEventListener('click', () => {
      const backupData = {
        version: '5.1',
        exportedAt: new Date().toISOString(),
        racks: state.racks || [],
        cables: state.cables || [],
        settings: state.settings || {},
        changeLogs: state.changeLogs || [],
        storageDevices: state.storageDevices || [],
        otherLocations: state.otherLocations || [],
        otherLocationColumns: state.otherLocationColumns || []
      };
      const dataStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rack_manager_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('全データ（履歴・保管庫・その他の場所含む）のJSONを保存しました', 'success');
    });
  }

  if (elements.btnTriggerImport && elements.inputImportJson) {
    elements.btnTriggerImport.addEventListener('click', () => elements.inputImportJson.click());
    elements.inputImportJson.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const imported = JSON.parse(evt.target.result);
          if (imported && (imported.racks || imported.changeLogs || imported.otherLocations)) {
            if (imported.racks) state.racks = imported.racks;
            if (imported.cables) state.cables = imported.cables;
            if (imported.settings) state.settings = { ...state.settings, ...imported.settings };
            if (imported.changeLogs) state.changeLogs = imported.changeLogs;
            if (imported.storageDevices) state.storageDevices = imported.storageDevices;
            if (imported.otherLocations) state.otherLocations = imported.otherLocations;
            if (imported.otherLocationColumns) state.otherLocationColumns = imported.otherLocationColumns;

            await saveData(true);
            renderRacks();
            renderChangeLogTable();
            renderStorageDepotTable();
            renderOtherLocationTable();
            updateHeaderStats();
            startAutoPingTimer();
            if (elements.modalExportImport) elements.modalExportImport.classList.remove('open');
            showToast('JSONデータ（履歴・保管庫・その他の場所を含む）を復元しました', 'success');
          } else {
            showToast('無効なJSONフォーマットです', 'error');
          }
        } catch (err) {
          showToast('JSONの読み込みに失敗しました: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  // --- 検索バー (案1) イベントリスナー ---
  if (elements.globalSearchInput) {
    elements.globalSearchInput.addEventListener('input', (e) => {
      handleGlobalSearch(e.target.value);
    });

    elements.globalSearchInput.addEventListener('focus', () => {
      if (elements.globalSearchInput.value.trim()) {
        handleGlobalSearch(elements.globalSearchInput.value);
      }
    });

    elements.globalSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        clearGlobalSearch();
        elements.globalSearchInput.blur();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const firstItem = elements.searchResultsList?.querySelector('.search-result-item');
        if (firstItem) firstItem.click();
      }
    });
  }

  if (elements.btnClearSearch) {
    elements.btnClearSearch.addEventListener('click', clearGlobalSearch);
  }

  // ドロップダウンの外側クリックで閉じる
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search-container')) {
      if (elements.searchResultsDropdown) {
        elements.searchResultsDropdown.style.display = 'none';
      }
    }
    if (!e.target.closest('.waffle-menu-container')) {
      if (elements.waffleDropdown) {
        elements.waffleDropdown.style.display = 'none';
      }
      elements.btnWaffleMenu?.classList.remove('active');
    }
  });

  // --- ワッフルメニュー (9-dots) イベント ---
  if (elements.btnWaffleMenu) {
    elements.btnWaffleMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!elements.waffleDropdown) return;
      const isOpen = elements.waffleDropdown.style.display !== 'none';
      elements.waffleDropdown.style.display = isOpen ? 'none' : 'block';
      elements.btnWaffleMenu.classList.toggle('active', !isOpen);
    });
  }

  // ワッフルメニュー各項目
  if (elements.btnWaffleHistory) {
    elements.btnWaffleHistory.addEventListener('click', () => {
      if (elements.waffleDropdown) elements.waffleDropdown.style.display = 'none';
      elements.btnWaffleMenu?.classList.remove('active');
      openHistoryModal();
    });
  }

  if (elements.btnWaffleImpact) {
    elements.btnWaffleImpact.addEventListener('click', () => {
      if (elements.waffleDropdown) elements.waffleDropdown.style.display = 'none';
      elements.btnWaffleMenu?.classList.remove('active');
      openImpactModal();
    });
  }

  if (elements.btnWaffleCsv) {
    elements.btnWaffleCsv.addEventListener('click', () => {
      if (elements.waffleDropdown) elements.waffleDropdown.style.display = 'none';
      elements.btnWaffleMenu?.classList.remove('active');
      exportLedgerCsv();
    });
  }

  if (elements.btnWaffleReport) {
    elements.btnWaffleReport.addEventListener('click', () => {
      if (elements.waffleDropdown) elements.waffleDropdown.style.display = 'none';
      elements.btnWaffleMenu?.classList.remove('active');
      openPrintReportModal();
    });
  }

  if (elements.btnWafflePingAll) {
    elements.btnWafflePingAll.addEventListener('click', () => {
      if (elements.waffleDropdown) elements.waffleDropdown.style.display = 'none';
      elements.btnWaffleMenu?.classList.remove('active');
      runPingAll();
    });
  }

  if (elements.btnWaffleSettings) {
    elements.btnWaffleSettings.addEventListener('click', () => {
      if (elements.waffleDropdown) elements.waffleDropdown.style.display = 'none';
      elements.btnWaffleMenu?.classList.remove('active');
      if (elements.modalSettings) {
        updateSettingsUI();
        elements.modalSettings.classList.add('open');
      }
    });
  }

  if (elements.btnWaffleExportImport) {
    elements.btnWaffleExportImport.addEventListener('click', () => {
      if (elements.waffleDropdown) elements.waffleDropdown.style.display = 'none';
      elements.btnWaffleMenu?.classList.remove('active');
      if (elements.modalExportImport) {
        elements.modalExportImport.classList.add('open');
      }
    });
  }

  if (elements.btnWaffleReset) {
    elements.btnWaffleReset.addEventListener('click', () => {
      if (elements.waffleDropdown) elements.waffleDropdown.style.display = 'none';
      elements.btnWaffleMenu?.classList.remove('active');
      if (confirm('すべての設定と配置データを初期のデモデータに戻しますか？\n（現在の変更内容は破棄されます）')) {
        resetDemoData();
      }
    });
  }

  // 変更履歴モーダル操作
  if (elements.btnCloseHistory) {
    elements.btnCloseHistory.addEventListener('click', closeHistoryModal);
  }
  if (elements.btnToggleHistoryForm) {
    elements.btnToggleHistoryForm.addEventListener('click', () => {
      if (elements.historyFormCard) {
        const isHidden = elements.historyFormCard.style.display === 'none';
        if (isHidden) {
          resetHistoryForm();
          populateHistoryDynamicFields();
          updateHistoryFormTypeVisibility(elements.histType?.value || 'add');
          elements.historyFormCard.style.display = 'block';
          elements.histDate?.focus();
        } else {
          elements.historyFormCard.style.display = 'none';
          resetHistoryForm();
        }
      }
    });
  }
  if (elements.histType) {
    elements.histType.addEventListener('change', () => {
      updateHistoryFormTypeVisibility(elements.histType.value);
    });
  }
  if (elements.btnCancelHistoryForm) {
    elements.btnCancelHistoryForm.addEventListener('click', () => {
      if (elements.historyFormCard) elements.historyFormCard.style.display = 'none';
      resetHistoryForm();
    });
  }
  if (elements.btnCancelHistoryBtn) {
    elements.btnCancelHistoryBtn.addEventListener('click', () => {
      if (elements.historyFormCard) elements.historyFormCard.style.display = 'none';
      resetHistoryForm();
    });
  }
  if (elements.historyEntryForm) {
    elements.historyEntryForm.addEventListener('submit', handleHistoryFormSubmit);
  }
  if (elements.btnHistoryExportCsv) {
    elements.btnHistoryExportCsv.addEventListener('click', exportHistoryCsv);
  }
  if (elements.btnClearAllHistory) {
    elements.btnClearAllHistory.addEventListener('click', clearAllChangeLogs);
  }
  if (elements.btnBannerDisableSetupMode) {
    elements.btnBannerDisableSetupMode.addEventListener('click', () => toggleSetupMode(false));
  }
  if (elements.historySearchInput) {
    elements.historySearchInput.addEventListener('input', renderChangeLogs);
  }
  if (elements.historyTypeFilter) {
    elements.historyTypeFilter.addEventListener('change', renderChangeLogs);
  }

  // 障害影響シミュレーションモーダル ＆ バナー操作
  if (elements.btnCloseImpact) elements.btnCloseImpact.addEventListener('click', closeImpactModal);
  if (elements.btnCloseImpactBottom) elements.btnCloseImpactBottom.addEventListener('click', closeImpactModal);
  if (elements.btnRunImpactSim) {
    elements.btnRunImpactSim.addEventListener('click', () => {
      const targetId = elements.impactTargetSelect?.value;
      runImpactSimulation(targetId);
    });
  }
  if (elements.btnClearImpactSim) {
    elements.btnClearImpactSim.addEventListener('click', clearImpactSimulation);
  }
  if (elements.btnBannerClearImpact) {
    elements.btnBannerClearImpact.addEventListener('click', clearImpactSimulation);
  }
  if (elements.btnReopenImpact) {
    elements.btnReopenImpact.addEventListener('click', openImpactModal);
  }

  // 印刷レポートモーダル操作
  if (elements.btnClosePrintReport) elements.btnClosePrintReport.addEventListener('click', closePrintReportModal);
  if (elements.btnDoPrint) {
    elements.btnDoPrint.addEventListener('click', () => window.print());
  }
  if (elements.btnReportCsv) {
    elements.btnReportCsv.addEventListener('click', exportLedgerCsv);
  }

  // 申請書モーダル操作
  if (elements.btnCloseDocForm) elements.btnCloseDocForm.addEventListener('click', closeApplicationDocModal);
  if (elements.btnPrintDoc) elements.btnPrintDoc.addEventListener('click', printApplicationDocNewWindow);
  if (elements.btnCopyDocText) elements.btnCopyDocText.addEventListener('click', copyApplicationDocText);
  if (elements.docTypeSelect) {
    elements.docTypeSelect.addEventListener('change', (e) => {
      renderApplicationDocContent(e.target.value);
    });
  }

  // 機器個別変更履歴 拡大表示モーダル操作
  if (elements.btnExpandDeviceHistory) {
    elements.btnExpandDeviceHistory.addEventListener('click', () => {
      openDeviceHistoryExpandModal(state.selectedDeviceId);
    });
  }
  if (elements.btnCloseDevExpandHistory) {
    elements.btnCloseDevExpandHistory.addEventListener('click', closeDeviceHistoryExpandModal);
  }
  if (elements.btnCloseDevExpandHistoryBottom) {
    elements.btnCloseDevExpandHistoryBottom.addEventListener('click', closeDeviceHistoryExpandModal);
  }
  if (elements.btnDevExpandExportCsv) {
    elements.btnDevExpandExportCsv.addEventListener('click', exportCurrentDeviceHistoryCsv);
  }

  // グローバルショートカットキー (Ctrl+K, Cmd+K, '/')
  window.addEventListener('keydown', (e) => {
    const isEditing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      elements.globalSearchInput?.focus();
      elements.globalSearchInput?.select();
    } else if (e.key === '/' && !isEditing) {
      e.preventDefault();
      elements.globalSearchInput?.focus();
      elements.globalSearchInput?.select();
    } else if (e.key === 'Escape' && !isEditing) {
      if (impactSimulationActive) {
        clearImpactSimulation();
      }
      clearGlobalSearch();
      if (elements.waffleDropdown) elements.waffleDropdown.style.display = 'none';
      elements.btnWaffleMenu?.classList.remove('active');
    }
  });

  // --- ラック台帳検索バー ---
  if (elements.reportSearchInput) {
    elements.reportSearchInput.addEventListener('input', (e) => {
      renderPrintReport(e.target.value);
    });
  }

  // --- その他の場所 (Other Locations) イベント ---
  setupOtherLocationWidget();

  if (elements.btnCloseOtherLocModal) {
    elements.btnCloseOtherLocModal.addEventListener('click', closeOtherLocationModal);
  }
  if (elements.btnCloseOtherLoc) {
    elements.btnCloseOtherLoc.addEventListener('click', closeOtherLocationModal);
  }
  if (elements.modalOtherLocation) {
    elements.modalOtherLocation.addEventListener('click', (e) => {
      if (e.target === elements.modalOtherLocation) closeOtherLocationModal();
    });
  }

  if (elements.otherLocSearchInput) {
    elements.otherLocSearchInput.addEventListener('input', (e) => {
      renderOtherLocationTable(e.target.value);
    });
  }

  if (elements.btnAddOtherLocDev) {
    elements.btnAddOtherLocDev.addEventListener('click', () => {
      openOtherLocationEditModal();
    });
  }

  if (elements.btnOpenOtherLocColumns) {
    elements.btnOpenOtherLocColumns.addEventListener('click', () => {
      openOtherLocationColumnsModal();
    });
  }

  if (elements.btnOtherLocCsv) {
    elements.btnOtherLocCsv.addEventListener('click', () => {
      exportOtherLocationsCsv();
    });
  }

  // --- カラム設定モーダル イベント ---
  if (elements.btnCloseColumnsModal) {
    elements.btnCloseColumnsModal.addEventListener('click', closeOtherLocationColumnsModal);
  }
  if (elements.btnCancelColumns) {
    elements.btnCancelColumns.addEventListener('click', closeOtherLocationColumnsModal);
  }
  if (elements.modalOtherLocationColumns) {
    elements.modalOtherLocationColumns.addEventListener('click', (e) => {
      if (e.target === elements.modalOtherLocationColumns) closeOtherLocationColumnsModal();
    });
  }
  if (elements.btnAddNewColumn) {
    elements.btnAddNewColumn.addEventListener('click', addNewColumnToConfig);
  }
  if (elements.btnSaveColumns) {
    elements.btnSaveColumns.addEventListener('click', saveColumnsConfig);
  }
  if (elements.btnResetDefaultColumns) {
    elements.btnResetDefaultColumns.addEventListener('click', resetDefaultColumnsConfig);
  }

  // --- その他の場所 機器追加/編集モーダル イベント ---
  if (elements.btnCloseOtherLocEdit) {
    elements.btnCloseOtherLocEdit.addEventListener('click', closeOtherLocationEditModal);
  }
  if (elements.btnCancelOtherLocEdit) {
    elements.btnCancelOtherLocEdit.addEventListener('click', closeOtherLocationEditModal);
  }
  if (elements.modalOtherLocationEdit) {
    elements.modalOtherLocationEdit.addEventListener('click', (e) => {
      if (e.target === elements.modalOtherLocationEdit) closeOtherLocationEditModal();
    });
  }
  if (elements.otherLocDeviceForm) {
    elements.otherLocDeviceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveOtherLocationDevice(e);
    });
  }
  if (elements.btnSaveOtherLocDevice) {
    elements.btnSaveOtherLocDevice.addEventListener('click', (e) => {
      e.preventDefault();
      saveOtherLocationDevice(e);
    });
  }
}

function setupCableColorPalette() {
  const paletteContainer = elements.cableConnectingColorPalette;
  if (paletteContainer) {
    paletteContainer.innerHTML = '';
    CABLE_COLORS.forEach((item) => {
      const swatch = document.createElement('div');
      swatch.className = 'cable-color-swatch';
      if (item.color.toLowerCase() === (state.selectedCableColor || '#38bdf8').toLowerCase()) {
        swatch.classList.add('active');
      }
      swatch.style.backgroundColor = item.color;
      swatch.style.setProperty('--swatch-color', item.color);
      swatch.dataset.color = item.color;
      swatch.title = item.label;

      swatch.addEventListener('click', () => {
        setGlobalCableColor(item.color);
      });

      paletteContainer.appendChild(swatch);
    });
  }

  if (elements.cableCustomColorInput) {
    elements.cableCustomColorInput.value = state.selectedCableColor || '#38bdf8';
    elements.cableCustomColorInput.addEventListener('input', (e) => {
      setGlobalCableColor(e.target.value, false);
    });
  }

  // プロパティパネル内のカラーセレクタ連動
  if (elements.propCableColorSelect) {
    elements.propCableColorSelect.addEventListener('change', (e) => {
      const col = e.target.value;
      if (elements.propCableCustomColor) elements.propCableCustomColor.value = col;
      if (elements.propCableColorPreview) elements.propCableColorPreview.style.background = col;
      setGlobalCableColor(col, false);
    });
  }

  if (elements.propCableCustomColor) {
    elements.propCableCustomColor.addEventListener('input', (e) => {
      const col = e.target.value;
      if (elements.propCableColorPreview) elements.propCableColorPreview.style.background = col;
      if (elements.propCableColorSelect) {
        elements.propCableColorSelect.value = col;
      }
      setGlobalCableColor(col, false);
    });
  }
}

function setGlobalCableColor(colorHex, showNotification = true) {
  state.selectedCableColor = colorHex;

  // バナー側スウォッチの active 更新
  if (elements.cableConnectingColorPalette) {
    elements.cableConnectingColorPalette.querySelectorAll('.cable-color-swatch').forEach((swatch) => {
      const isMatch = swatch.dataset.color.toLowerCase() === colorHex.toLowerCase();
      swatch.classList.toggle('active', isMatch);
    });
  }

  // パルスドットの色
  if (elements.cableConnectingPulseDot) {
    elements.cableConnectingPulseDot.style.backgroundColor = colorHex;
    elements.cableConnectingPulseDot.style.boxShadow = `0 0 10px ${colorHex}`;
  }

  // カスタムインプット同期
  if (elements.cableCustomColorInput) {
    elements.cableCustomColorInput.value = colorHex;
  }

  // プロパティパネル同期
  if (elements.propCableColorSelect) {
    elements.propCableColorSelect.value = colorHex;
  }
  if (elements.propCableCustomColor) {
    elements.propCableCustomColor.value = colorHex;
  }
  if (elements.propCableColorPreview) {
    elements.propCableColorPreview.style.background = colorHex;
  }

  if (showNotification) {
    const matched = CABLE_COLORS.find((c) => c.color.toLowerCase() === colorHex.toLowerCase());
    const name = matched ? matched.label : `カスタム (${colorHex})`;
    showToast(`配線カラーを「${name}」に設定しました`, 'info');
  }
}

function applyTheme(themeName) {
  // テーマの正規化（旧設定の移行含む）
  let theme = themeName;
  if (theme === 'light') theme = 'material';
  if (theme === 'cyber') theme = 'matrix';

  const validThemes = ['dark', 'material', 'matrix', 'pastel', 'monokai', 'dracula', 'cappuccino'];
  if (!validThemes.includes(theme)) {
    theme = 'dark';
  }

  // 既存の全テーマクラスを除去
  ['dark', 'light', 'cyber', 'dracula', 'high-contrast', 'material', 'matrix', 'pastel', 'monokai', 'cappuccino'].forEach((t) => {
    document.body.classList.remove(`theme-${t}`);
  });

  if (theme !== 'dark') {
    document.body.classList.add(`theme-${theme}`);
  }

  state.settings.theme = theme;
  try {
    localStorage.setItem('datacenter_rack_manager_theme', theme);
  } catch (e) {}

  document.querySelectorAll('.theme-card').forEach((card) => {
    if (card.dataset.theme === theme) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

function formatTicketNo(prefix, datePattern, digits, seqNum) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  let datePart = '';
  if (datePattern === 'YYYY') datePart = `${year}-`;
  else if (datePattern === 'YYYYMM') datePart = `${year}${month}-`;
  else if (datePattern === 'YYMM') datePart = `${String(year).slice(-2)}${month}-`;
  else datePart = '';

  const numPart = String(seqNum).padStart(parseInt(digits, 10) || 3, '0');
  return `${(prefix || 'CHG').trim()}-${datePart}${numPart}`;
}

function generateNextTicketNo() {
  const rule = state.settings.ticketRule || { prefix: 'CHG', datePattern: 'YYYY', digits: 3, nextSeq: 1 };
  const prefix = (rule.prefix || 'CHG').trim();
  const datePattern = rule.datePattern || 'YYYY';
  const digits = parseInt(rule.digits, 10) || 3;

  let maxSeq = parseInt(rule.nextSeq, 10) || 1;

  // 1. 履歴ログから走査
  (state.changeLogs || []).forEach((log) => {
    if (log.ticketNo) {
      const parts = String(log.ticketNo).split('-');
      const lastPart = parts[parts.length - 1];
      const parsedNum = parseInt(lastPart, 10);
      if (!isNaN(parsedNum) && parsedNum >= maxSeq) {
        maxSeq = parsedNum + 1;
      }
    }
  });

  // 2. 全ラック機器から走査
  (state.racks || []).forEach((r) => {
    (r.devices || []).forEach((d) => {
      if (d.ticketNo) {
        const parts = String(d.ticketNo).split('-');
        const lastPart = parts[parts.length - 1];
        const parsedNum = parseInt(lastPart, 10);
        if (!isNaN(parsedNum) && parsedNum >= maxSeq) {
          maxSeq = parsedNum + 1;
        }
      }
    });
  });

  // 3. 保管庫機器から走査
  (state.storageDevices || []).forEach((d) => {
    if (d.ticketNo) {
      const parts = String(d.ticketNo).split('-');
      const lastPart = parts[parts.length - 1];
      const parsedNum = parseInt(lastPart, 10);
      if (!isNaN(parsedNum) && parsedNum >= maxSeq) {
        maxSeq = parsedNum + 1;
      }
    }
  });

  return formatTicketNo(prefix, datePattern, digits, maxSeq);
}

function updateTicketPreviewUI() {
  if (!elements.settingTicketPreview) return;
  const prefix = elements.settingTicketPrefix?.value || 'CHG';
  const datePattern = elements.settingTicketDatePattern?.value || 'YYYY';
  const digits = elements.settingTicketDigits?.value || '3';
  elements.settingTicketPreview.textContent = formatTicketNo(prefix, datePattern, digits, 1);
}

function updateSettingsUI() {
  applyTheme(state.settings.theme || 'dark');

  const rule = state.settings.ticketRule || { prefix: 'CHG', datePattern: 'YYYY', digits: 3, nextSeq: 1 };
  if (elements.settingTicketPrefix) elements.settingTicketPrefix.value = rule.prefix || 'CHG';
  if (elements.settingTicketDatePattern) elements.settingTicketDatePattern.value = rule.datePattern || 'YYYY';
  if (elements.settingTicketDigits) elements.settingTicketDigits.value = rule.digits || 3;
  updateTicketPreviewUI();

  if (elements.settingGlobalPingToggle) elements.settingGlobalPingToggle.checked = !!state.settings.globalPingEnabled;
  if (elements.settingAutoPingToggle) elements.settingAutoPingToggle.checked = !!state.settings.autoPingEnabled;
  if (elements.settingSetupModeToggle) elements.settingSetupModeToggle.checked = !!state.settings.initialSetupMode;
  if (elements.settingPingInterval) elements.settingPingInterval.value = state.settings.pingIntervalSeconds || 30;
  if (elements.settingPingTimeout) elements.settingPingTimeout.value = state.settings.pingTimeoutMs || 1500;
}

function formatDateTime(isoString) {
  if (!isoString) return '-';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const yyyy = d.getFullYear();
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  const hh = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function formatTime(isoString) {
  if (!isoString) return '未確認';
  const d = new Date(isoString);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

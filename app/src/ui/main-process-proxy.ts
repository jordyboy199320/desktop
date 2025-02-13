import { ExecutableMenuItem } from '../models/app-menu'
import { RequestResponseChannels, RequestChannels } from '../lib/ipc-shared'
import * as ipcRenderer from '../lib/ipc-renderer'

/**
 * Creates a strongly typed proxy method for sending a duplex IPC message to the
 * main process. The parameter types and return type are infered from the
 * RequestResponseChannels type which defines the valid duplex channel names.
 *
 * @param numArgs The number of arguments that the channel expects. We specify
 *                this so that we don't accidentally send more things over the
 *                IPC boundary than we intended to which can lead to runtime
 *                errors.
 *
 *                This is necessary because TypeScript allows passing more
 *                arguments than defined to functions which in turn means that
 *                functions without arguments are type compatible with all
 *                functions that share the same return type.
 */
export function invokeProxy<T extends keyof RequestResponseChannels>(
  channel: T,
  numArgs: ParameterCount<RequestResponseChannels[T]>
) {
  return (...args: Parameters<RequestResponseChannels[T]>) => {
    // This as any cast here may seem unsafe but it isn't since we're guaranteed
    // that numArgs will match the parameter count of the IPC declaration.
    args = args.length !== numArgs ? (args.slice(0, numArgs) as any) : args
    return ipcRenderer.invoke(channel, ...args)
  }
}

/**
 * Creates a strongly typed proxy method for sending a simplex IPC message to
 * the main process. The parameter types are infered from the
 * RequestResponseChannels type which defines the valid duplex channel names.
 *
 * @param numArgs The number of arguments that the channel expects. We specify
 *                this so that we don't accidentally send more things over the
 *                IPC boundary than we intended to which can lead to runtime
 *                errors.
 *
 *                This is necessary because TypeScript allows passing more
 *                arguments than defined to functions which in turn means that
 *                functions without arguments are type compatible with all
 *                functions that share the same return type.
 */
export function sendProxy<T extends keyof RequestChannels>(
  channel: T,
  numArgs: ParameterCount<RequestChannels[T]>
) {
  return (...args: Parameters<RequestChannels[T]>) => {
    // This as any cast here may seem unsafe but it isn't since we're guaranteed
    // that numArgs will match the parameter count of the IPC declaration.
    args = args.length !== numArgs ? (args.slice(0, numArgs) as any) : args
    ipcRenderer.send(channel, ...args)
  }
}

/**
 * Tell the main process to select all of the current web contents
 */
export const selectAllWindowContents = sendProxy(
  'select-all-window-contents',
  0
)

/** Set the menu item's enabledness. */
export const updateMenuState = sendProxy('update-menu-state', 1)

/** Tell the main process that the renderer is ready. */
export const sendReady = sendProxy('renderer-ready', 1)

/** Tell the main process to execute (i.e. simulate a click of) the menu item. */
export const executeMenuItem = (item: ExecutableMenuItem) =>
  executeMenuItemById(item.id)

/** Tell the main process to execute (i.e. simulate a click of) the menu item. */
export const executeMenuItemById = sendProxy('execute-menu-item-by-id', 1)

/**
 * Tell the main process to obtain whether the window is focused.
 */
export const isWindowFocused = invokeProxy('is-window-focused', 0)

/** Tell the main process to focus on the main window. */
export const focusWindow = sendProxy('focus-window', 0)

export const showItemInFolder = sendProxy('show-item-in-folder', 1)
export const showFolderContents = sendProxy('show-folder-contents', 1)
export const openExternal = invokeProxy('open-external', 1)
export const moveItemToTrash = invokeProxy('move-to-trash', 1)

/** Tell the main process to obtain the current window state */
export const getCurrentWindowState = invokeProxy('get-current-window-state', 0)

/** Tell the main process to obtain the current window's zoom factor */
export const getCurrentWindowZoomFactor = invokeProxy(
  'get-current-window-zoom-factor',
  0
)

/** Tell the main process to check for app updates */
export const checkForUpdates = invokeProxy('check-for-updates', 1)

/** Tell the main process to quit the app and install updates */
export const quitAndInstallUpdate = sendProxy('quit-and-install-updates', 0)

/** Subscribes to auto updater error events originating from the main process */
export function onAutoUpdaterError(
  errorHandler: (evt: Electron.IpcRendererEvent, error: Error) => void
) {
  ipcRenderer.on('auto-updater-error', errorHandler)
}

/** Subscribes to auto updater checking for update events originating from the
 * main process */
export function onAutoUpdaterCheckingForUpdate(eventHandler: () => void) {
  ipcRenderer.on('auto-updater-checking-for-update', eventHandler)
}

/** Subscribes to auto updater update available events originating from the
 * main process */
export function onAutoUpdaterUpdateAvailable(eventHandler: () => void) {
  ipcRenderer.on('auto-updater-update-available', eventHandler)
}

/** Subscribes to auto updater update not available events originating from the
 * main process */
export function onAutoUpdaterUpdateNotAvailable(eventHandler: () => void) {
  ipcRenderer.on('auto-updater-update-not-available', eventHandler)
}

/** Subscribes to auto updater update downloaded events originating from the
 * main process */
export function onAutoUpdaterUpdateDownloaded(eventHandler: () => void) {
  ipcRenderer.on('auto-updater-update-downloaded', eventHandler)
}

/** Subscribes to the native theme updated event originating from the main process */
export function onNativeThemeUpdated(eventHandler: () => void) {
  ipcRenderer.on('native-theme-updated', eventHandler)
}

/** Tell the main process to set the native theme source */
export const setNativeThemeSource = sendProxy('set-native-theme-source', 1)

/** Tell the main process to obtain wether the native theme uses dark colors */
export const shouldUseDarkColors = invokeProxy('should-use-dark-colors', 0)

/** Tell the main process to minimize the window */
export const minimizeWindow = sendProxy('minimize-window', 0)

/** Tell the main process to maximize the window */
export const maximizeWindow = sendProxy('maximize-window', 0)

/** Tell the main process to unmaximize the window */
export const restoreWindow = sendProxy('unmaximize-window', 0)

/** Tell the main process to close the window */
export const closeWindow = sendProxy('close-window', 0)

/** Tell the main process to get whether the window is maximized */
export const isWindowMaximized = invokeProxy('is-window-maximized', 0)

/** Tell the main process to get the users system preference for app action on
 * double click */
export const getAppleActionOnDoubleClick = invokeProxy(
  'get-apple-action-on-double-click',
  0
)

/**
 * Show the OS-provided certificate trust dialog for the certificate, using the
 * given message.
 */
export const showCertificateTrustDialog = sendProxy(
  'show-certificate-trust-dialog',
  2
)

/**
 * Tell the main process to obtain the applications path for given path type
 */
export const getPath = invokeProxy('get-path', 1)

/**
 * Tell the main process to obtain the applications architecture
 */
export const getAppArchitecture = invokeProxy('get-app-architecture', 0)

/**
 * Tell the main process to obtain the application's app path
 */
export const getAppPathProxy = invokeProxy('get-app-path', 0)

/**
 * Tell the main process to obtain whether the app is running under a rosetta
 * translation
 */
export const isRunningUnderRosettaTranslation = invokeProxy(
  'is-running-under-rosetta-translation',
  0
)

/**
 * Tell the main process that we're going to quit. This means it should allow
 * the window to close.
 *
 * This event is sent synchronously to avoid any races with subsequent calls
 * that would tell the app to quit.
 */
export function sendWillQuitSync() {
  // eslint-disable-next-line no-sync
  ipcRenderer.sendSync('will-quit')
}

/**
 * Tell the main process to move the application to the application folder
 */
export const moveToApplicationsFolder = sendProxy(
  'move-to-applications-folder',
  0
)

/**
 * Ask the main-process to send over a copy of the application menu.
 * The response will be send as a separate event with the name 'app-menu' and
 * will be received by the dispatcher.
 */
export const getAppMenu = sendProxy('get-app-menu', 0)

export const invokeContextualMenu = invokeProxy('show-contextual-menu', 2)

/** Update the menu item labels with the user's preferred apps. */
export const updatePreferredAppMenuItemLabels = sendProxy(
  'update-preferred-app-menu-item-labels',
  1
)

function getIpcFriendlyError(error: Error) {
  return {
    message: error.message || `${error}`,
    name: error.name || `${error.name}`,
    stack: error.stack || undefined,
  }
}

export const _reportUncaughtException = sendProxy('uncaught-exception', 1)

export function reportUncaughtException(error: Error) {
  _reportUncaughtException(getIpcFriendlyError(error))
}

const _sendErrorReport = sendProxy('send-error-report', 3)

export function sendErrorReport(
  error: Error,
  extra: Record<string, string>,
  nonFatal: boolean
) {
  _sendErrorReport(getIpcFriendlyError(error), extra, nonFatal)
}

export const updateAccounts = sendProxy('update-accounts', 1)

/** Tells the main process to resolve the proxy for a given url */
export const resolveProxy = invokeProxy('resolve-proxy', 1)

/**
 * Tell the main process to obtain whether the Desktop application is in the
 * application folder
 *
 * Note: will return null when not running on darwin
 */
export const isInApplicationFolder = invokeProxy('is-in-application-folder', 0)

/**
 * Tell the main process to show save dialog
 */
export const showSaveDialog = invokeProxy('show-save-dialog', 1)

/**
 * Tell the main process to show open dialog
 */
export const showOpenDialog = invokeProxy('show-open-dialog', 1)

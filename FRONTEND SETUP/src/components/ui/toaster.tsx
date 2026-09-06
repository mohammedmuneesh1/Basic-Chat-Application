"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
  overlap:true,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster
       toaster={toaster}
        insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="lg"  color="blue.solid" />
            ) : (
              <Toast.Indicator marginTop={3} marginLeft={2}  />
            )}
            <Stack
            paddingTop={2}
            paddingBottom={2}
            gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title
              fontSize="lg"
              >{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description
                fontSize="md" 
                >{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}

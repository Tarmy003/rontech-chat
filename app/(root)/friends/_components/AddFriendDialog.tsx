"use client"
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMutationState } from '@/hooks/useMutationState'
import { ConvexError } from 'convex/values'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'



const addFriendFormSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email' }),
})

const AddFriendDialog = () => {
    const {mutate: createRequest, pending} = useMutationState(api.request.create);

    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver(addFriendFormSchema),
        defaultValues: {
            email: "",
        },
    });
    const handleSubmit = async (values: z.infer<typeof addFriendFormSchema>) => {
        await createRequest({email: values.email})
            .then(() => {
                form.reset();
                toast.success("Friend request sent!");
            })
            .catch((error) => {
                toast.error(error instanceof ConvexError ? error.data : "An error occurred");
            });
    };

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button size="icon" variant="outline">
                            <UserPlus />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add Friend</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Friend</DialogTitle>
                    <DialogDescription>Send a request to connect with your colleagues</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <FormField control={form.control} name="email" render={({field}) => <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="Email..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>}
                        
                        />
                        <DialogFooter>
                        <Button disabled={pending} type="submit">
                            Send
                        </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddFriendDialog
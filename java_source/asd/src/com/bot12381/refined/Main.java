package com.bot12381.refined;

import java.util.ArrayList;
import java.util.HashMap;

import com.zhekasmirnov.apparatus.api.container.ItemContainer;
import com.zhekasmirnov.horizon.runtime.logger.Logger;
import java.lang.System;
import com.zhekasmirnov.innercore.api.mod.recipes.workbench.RecipeEntry;
import com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchRecipe;
import com.zhekasmirnov.innercore.api.mod.recipes.workbench.WorkbenchRecipeRegistry;
import org.mozilla.javascript.ScriptableObject;
import com.zhekasmirnov.innercore.api.NativeItemInstanceExtra;
import com.zhekasmirnov.innercore.api.commontypes.ItemInstance;
import java.util.List;
import java.util.Iterator;
import com.zhekasmirnov.innercore.api.mod.ScriptableObjectHelper;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI;
import com.zhekasmirnov.innercore.api.mod.adaptedscript.AdaptedScriptAPI.Item;
import java.util.HashSet;
import com.zhekasmirnov.innercore.api.NativeItem;
import org.mozilla.javascript.ConsString;
import java.lang.CharSequence;
import java.util.Comparator;
import com.zhekasmirnov.apparatus.api.container.ItemContainerSlot;
import java.util.Arrays;
//import org.mozilla.javascript.NativeArray;

public class Main {
    public static void boot(HashMap data) {
        Logger.debug("Refined Storage", "Loading java side...");
    }
    public Main(){

    }
    public long test(){
        long startTime = System.currentTimeMillis();
        ArrayList a = new ArrayList<Integer>();
        for(int i = 0; i < 1000000; i++){
            a.add(i);
        };
        return System.currentTimeMillis() - startTime;
    }
    public String getItemUid(RecipeEntry item){
        return item.id + "_" + item.data;
    }
    public String getItemUid(ItemInstance item){
        return item.getId() + "_" + item.getData() + (item.getExtraValue() != 0 ? "_" + item.getExtraValue() : "");
    }
    public Object[] sortCrafts(List items, String textSearch, ScriptableObject originalOnlyItemsMap, ScriptableObject items2){
        HashSet hashSet = new HashSet();
        Object[] allIds = items.toArray();
        Logger.debug("RefinedStorageDebug", "Items length: " + allIds.length);
        for(int i = 0; i < allIds.length; i++){
            ItemContainerSlot item = (ItemContainerSlot) ScriptableObjectHelper.getProperty(items2, String.valueOf(allIds[i]), null);
            WorkbenchRecipeRegistry.addRecipesThatContainItem(item.id, item.data, hashSet);
        }
        ArrayList<WorkbenchRecipe> newArray = new ArrayList<WorkbenchRecipe>();
        ArrayList<WorkbenchRecipe> posArray = new ArrayList<WorkbenchRecipe>();
        Iterator<WorkbenchRecipe> it = hashSet.iterator();
        while (it.hasNext()) {
            WorkbenchRecipe jRecipe = it.next();
            if(!textSearch.equals("-1nullfalse")) {
                ItemInstance result = jRecipe.getResult();
                String name = NativeItem.getNameForId(result.getId(), result.getData() != -1 ? result.getData() : 0);
                if(name.toLowerCase().indexOf(textSearch.toLowerCase()) == -1) continue;
            }
            if(isDarkenSlot(jRecipe, originalOnlyItemsMap)){
                newArray.add(jRecipe);
            } else {
                posArray.add(jRecipe);
            }
        }
        posArray.addAll(newArray);
        Logger.debug("RefinedStorageDebug", "Sorting ended");
        return posArray.toArray();
    }
    public Object[] sortCrafts(ScriptableObject items, String textSearch, ScriptableObject originalOnlyItemsMap){
        HashSet hashSet = new HashSet();
        Object[] allIds = items.getAllIds();
        for(int i = 0; i < allIds.length; i++){
            ItemContainerSlot item = (ItemContainerSlot) ScriptableObjectHelper.getProperty(items, String.valueOf(allIds[i]), null);
            WorkbenchRecipeRegistry.addRecipesThatContainItem(item.id, item.data, hashSet);
        }
        ArrayList<WorkbenchRecipe> newArray = new ArrayList<WorkbenchRecipe>();
        ArrayList<WorkbenchRecipe> posArray = new ArrayList<WorkbenchRecipe>();
        Iterator<WorkbenchRecipe> it = hashSet.iterator();
        while (it.hasNext()) {
            WorkbenchRecipe jRecipe = it.next();
            if(!textSearch.equals("-1nullfalse")) {
                ItemInstance result = jRecipe.getResult();
                String name = NativeItem.getNameForId(result.getId(), result.getData() != -1 ? result.getData() : 0);
                if(!name.matches(textSearch)) continue;
            }
            if(isDarkenSlot(jRecipe, originalOnlyItemsMap)){
                newArray.add(jRecipe);
            } else {
                posArray.add(jRecipe);
            }
        }
        posArray.addAll(newArray);
        return posArray.toArray();
    }
    public boolean isDarkenSlot(WorkbenchRecipe javaRecipe, ScriptableObject originalOnlyItemsMap){
        Iterator<RecipeEntry> values = javaRecipe.getEntryCollection().iterator();
        while (values.hasNext()) {
            RecipeEntry item = values.next();
            if(item == null || item.id == 0) continue;
            List<Object> Array = (List<Object>) originalOnlyItemsMap.get((item != null ? item.id : 0));
            if(Array == null || (item.data != -1 && !Array.contains(Integer.valueOf(item.data)))) {
                return true;
            }
        }
		return false;
    }
    public void sortItems(int sortType, boolean isReverse, ItemContainer container, List<ConsString> array){
        /* Comparator<ConsString> comparator = new Comparator<ConsString>(){
            public int compare(ConsString o1, ConsString o2) {
                int x = container.getSlot(o1.toString()).getId();
                int y = container.getSlot(o2.toString()).getId();
                Logger.debug("Refined Storage", "Comparing " + x + " : " + y);
                //return container.getSlot(o1.toString()).getId() - container.getSlot(o2.toString()).getId();
                return (x < y) ? -1 : ((x == y) ? 0 : 1);
            }
        };
        array.sort(comparator); */
    }
}